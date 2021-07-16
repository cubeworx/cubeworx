import EventEmitter from 'events';
import Docker from 'dockerode';
import BedrockServer from './BedrockServer.js';

const UPDATE_FREQUENCY = 1000;

/*
* Manages a single container holding a Bedrock server.
*/
export default class Container extends EventEmitter {
  constructor(id, name) {
    super();
    this._id = id;
    this._name = name;
    this._status = null;
    this._image = null;
    this._ipAddress = null;
    this._privatePort = null;
    this._publicPort = null;
    this._serverName = null;
    this._docker = new Docker();
    this._dockerContainer = this._docker.getContainer(this._id);
    this._updateTimeout = null;
    this._bedrockServer = null;
    this._onBedrockServerChangedListener = this._onBedrockServerChanged.bind(this);
    this._update();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name ? this._name.replace(/^\/+/, '') : null;
  }

  get status() {
    return this._status;
  }

  get bedrockServer() {
    return this._bedrockServer;
  }

  async start() {
    await this._dockerContainer.start();
    await this._update();
  }

  async stop() {
    await this._dockerContainer.stop();
    await this._update();
  }

  async getLogs() {
    const data = await this._dockerContainer.logs({
      stdout: true,
      stderr: true,
      tail: 100
    });

    const logs = [];
    let index = 0;

    while (index < data.length) {
      const header = data.slice(index, index + 8);
      const size = header.readUInt32BE(4);
      index += 8;
      const log = data.slice(index, index + size).toString();
      logs.push(log.trim());
      index += size;
    }

    return logs;
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      image: this._image,
      ipAddress: this._ipAddress,
      privatePort: this._privatePort,
      publicPort: this._publicPort,
      serverName: this._serverName,
      server: this.bedrockServer && this.bedrockServer.pong ? this.bedrockServer.pong.properties : null
    };
  }

  close() {
    clearTimeout(this._updateTimeout);
    if (this._bedrockServer) {
      this._bedrockServer.close();
      this._bedrockServer = null;
    }
  }

  _update() {
    clearTimeout(this._updateTimeout);
    return this._dockerContainer.inspect()
      .then((inspection) => {
        const changed = this._updateInspection(inspection);
        this._updateTimeout = setTimeout(this._update.bind(this), UPDATE_FREQUENCY);
        if (changed) {
          this.emit('changed', this);
        }
      })
      .catch((error) => {
        console.log('Error inspecting container:');
        console.log(error.message);
        this._status = 'error';
        this.emit('changed', this);
      });
  }

  _updateInspection(inspection) {
    let changed = false;

    // Update container name
    const name = inspection.Name;
    if (name !== this._name) {
      this._name = name;
      changed = true;
    }

    // Update container status
    const status = inspection.State.Status;
    if (status !== this._status) {
      this._status = status;
      changed = true;
    }

    // Update container image name
    const image = inspection.Config.Image;
    if (image !== this._image) {
      this._image = image;
      changed = true;
    }

    // Update container ip address
    let ipAddress = null;
    const network = Object.values(inspection.NetworkSettings.Networks).find((n) => n.IPAddress);
    if (network) {
      ipAddress = network.IPAddress;
    }
    if (ipAddress !== this._ipAddress) {
      this._ipAddress = ipAddress;
      changed = true;
    }

    // Update container private/public ports
    let privatePort = null;
    let publicPort = null;
    const mappings = this._getCandidatePortMappings(inspection);
    if (mappings.length === 1) {
      const mapping = mappings[0];
      privatePort = mapping.privatePort;
      publicPort = mapping.publicPort;
    }
    if (privatePort !== this._privatePort) {
      this._privatePort = privatePort;
      changed = true;
    }
    if (publicPort !== this._publicPort) {
      this._publicPort = publicPort;
      changed = true;
    }

    // Update server name
    let serverName = null;
    const serverNameRegex = /^SERVER_NAME=(?<serverName>.*)/;
    const serverNameVariable = inspection.Config.Env.forEach((env) => {
      if (!serverName) {
        const result = env.match(serverNameRegex);
        if (result) {
          serverName = result.groups.serverName;
        }
      }
    });
    if (serverName !== this._serverName) {
      this._serverName = serverName;
      changed = true;
    }

    // Remove existing bedrock server whenever the container changes
    if (this._bedrockServer && changed) {
      this._bedrockServer.off('changed', this._onBedrockServerChangedListener);
      this._bedrockServer.close();
      this._bedrockServer = null;
    }

    // Create bedrock server if required
    if (!this._bedrockServer && this._status === 'running') {
      this._bedrockServer = new BedrockServer(this._ipAddress, this._privatePort, this._publicPort);
      this._bedrockServer.on('changed', this._onBedrockServerChangedListener);
    }

    return changed;
  }

  _getCandidatePortMappings(inspection) {
    const mappings = [];
    Object.entries(inspection.NetworkSettings.Ports)
      .forEach(([key, bindings]) => {
        if (key && bindings) {
          const matches = key.match(/^(?<udpPort>\d+)\/udp$/);
          if (matches) {
            const binding = bindings.find((binding) => binding.HostIp && binding.HostPort);
            if (binding) {
              mappings.push({
                privatePort: parseInt(matches.groups.udpPort, 10),
                publicPort: parseInt(binding.HostPort, 10)
              });
            }
          }
        }
      });
    return mappings;
  }

  _onBedrockServerChanged(bedrockServer) {
    this.emit('changed', this);
  }
}
