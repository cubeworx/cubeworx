import EventEmitter from 'events';
import ContainerIndex from './ContainerIndex.js';
import BedrockAnnouncer from './BedrockAnnouncer.js';

/*
* Tracks containers and announces servers to clients by forwarding pong packets.
*/
export default class Tracker extends EventEmitter {
  constructor(listenPort, io) {
    super();
    this._io = io;
    this._containerIndex = new ContainerIndex();
    this._announcer = new BedrockAnnouncer(listenPort);
    this._containerIndex.on('containerAdded', this._onContainerAdded.bind(this));
    this._containerIndex.on('containerRemoved', this._onContainerRemoved.bind(this));
    this._containerIndex.on('containerChanged', this._onContainerChanged.bind(this));
    this._announcer.on('ping', this._onAnnouncerPing.bind(this));
    this._containerIndex.update();
  }

  get containerIndex() {
    return this._containerIndex;
  }

  close() {
    if (this._containerIndex) {
      this._containerIndex.close();
      this._containerIndex = null;     
    }
    if (this._announcer) {
      this._announcer.close();
      this._announcer = null;
    }
  }

  _onAnnouncerPing(pingId, remoteInfo) {
    const pongs = this._containerIndex.containers
      .filter(container => container.bedrockServer && container.bedrockServer.pong)
      .map(container => container.bedrockServer.pong);
     this._announcer.announce(pingId, remoteInfo, pongs);
  }

  _onContainerAdded(container) {
    console.log(`Container ${container.name} has been added`);
    this._io.emit('containersUpdated', {
      containers: this._containerIndex.containers.map((c) => c.getData())
    });
  }

  _onContainerRemoved(container) {
    console.log(`Container ${container.name} has been removed`);
    this._io.emit('containersUpdated', {
      containers: this._containerIndex.containers.map((c) => c.getData())
    });
  }

  _onContainerChanged(container) {
    console.log(`Container ${container.name} has changed (${container.status}/${container.bedrockServer && container.bedrockServer.pong ? 'active' : 'inactive'})`);
    this._io.emit('containerChanged', {
      container: container.getData()
    });
  }
}