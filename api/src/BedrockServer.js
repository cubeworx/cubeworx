import EventEmitter from 'events';
import dgram from 'dgram';
import Serializer from 'raknet/src/transforms/serializer.js';
import BedrockPong from './BedrockPong.js';
import randomSigned32 from './utilities/randomSigned32.js'

const UPDATE_FREQUENCY = 1000;

/*
* Responsible for pinging a single Bedrock server and maintaining 
* a representation of its state.
*/
export default class BedrockServer extends EventEmitter {
  constructor(ipAddress, privatePort, publicPort) {
    super();
    this._ipAddress = ipAddress;
    this._privatePort = privatePort;
    this._publicPort = publicPort;
    this._pong = null;
    this._clientId = [randomSigned32(), randomSigned32()];
    this._socket = dgram.createSocket({ type: 'udp4' });
    this._serializer = Serializer.createSerializer(true);
    this._parser = Serializer.createDeserializer(true);
    this._receivedPong = null;
    this._updateTimeout = null;
    this._serializer.on('data', this._onSerializerData.bind(this));
    this._parser.on('data', this._onParserData.bind(this));
    this._socket.on('message', this._onSocketMessage.bind(this));
    this._socket.bind();
    this._update();
  }

  get pong() {
    return this._pong;
  }

  close() {
    clearTimeout(this._updateTimeout);
    if (this.socket) {
      this._socket.close();
      this._socket = null;
    }
  }

  _onSerializerData(chunk) {
    this._socket.send(chunk, 0, chunk.length, this._privatePort, this._ipAddress, (error) => {
      if (error) {
        console.log('Error sending ping to bedrock server:');
        console.log(error);
      }
    });
  }

  _onParserData(parsed) {
    if (parsed.data.name !== 'unconnected_pong') {
      console.log(`Received unexpected packet '${parsed.data.name}' from server ${this._ipAddress}`);
      return;
    }

    // Replace the port the server is running on internally with the port we know it's running on externally
    const params = parsed.data.params;
    const patchedServerId = params.serverName.replace(this._privatePort, this._publicPort);
    this._receivedPong = new BedrockPong(params.serverID, params.magic, patchedServerId);
  }

  _onSocketMessage(message) {
    this._parser.write(message);
  }

  _update() {
    // Process the response to our last ping
    if (this._receivedPong) {
      const changed = !this._pong || !this._pong.equalTo(this._receivedPong);
      this._pong = this._receivedPong;
      this._receivedPong = null;
      if (changed) {
        this.emit('changed');
      }
    } else {
      const changed = this._pong ? true : false;
      this._pong = null;
      if (changed) {
        this.emit('changed');
      }
    }

    // Send our next ping
    this._serializer.write({
      name: 'unconnected_ping',
      params: {
        pingID: [0, 1],
        magic: [0, 255, 255, 0, 254, 254, 254, 254, 253, 253, 253, 253, 18, 52, 86, 120],
        unknown: this._clientId,
      },
    });

    // Queue update
    clearTimeout(this._updateTimeout);
    this._updateTimeout = setTimeout(this._update.bind(this), UPDATE_FREQUENCY);
  }
}