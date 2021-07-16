import EventEmitter from 'events';
import dgram from 'dgram';
import Serializer from 'raknet/src/transforms/serializer.js';

/*
* Listens for pings from Bedrock clients and responds with pongs
* from all known servers.
*/
export default class BedrockAnnouncer extends EventEmitter {
  constructor(listenPort) {
    super();
    this.listenPort = listenPort;
    this._socket = dgram.createSocket({ type: 'udp4' });
    this._socket.on('listening', this._onSocketListening.bind(this));
    this._socket.on('message', this._onSocketMessage.bind(this));
    this._socket.bind(this.listenPort);
  }

  announce(pingId, remoteInfo, pongs) {
    const serializer = Serializer.createSerializer(true);
    serializer.on('data', (chunk) => {
      this._socket.send(chunk, 0, chunk.length, remoteInfo.port, remoteInfo.address);
    });

    pongs.forEach((pong) => {
      serializer.write({
        name: 'unconnected_pong',
        params: {
          pingID: pingId,
          serverID: pong.serverGuid,
          magic: pong.serverMagic,
          serverName: pong.serverId,
        },
      });
    });
  }

  close() {
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    }
  }

  _onSocketListening() {
    const address = this._socket.address();
    console.log(`Listening for client pings on ${address.address}:${address.port}`);
  }

  _onSocketMessage(message, remoteInfo) {
    const parser = Serializer.createDeserializer(true);
    parser.on('data', (parsed) => {
      if (parsed.data.name !== 'unconnected_ping') {
        console.log(`Received unexpected packet '${parsed.data.name}' on listen port ${this.listenPort}`);
      }
      this.emit('ping', parsed.data.params.pingID, remoteInfo);
    });

    parser.write(message);
  }
}