import EventEmitter from 'events';
import Docker from 'dockerode';
import Container from './Container.js';

const TARGET_LABEL = 'cbwx.mcbe-announce.enable';
const UPDATE_FREQUENCY = 5000;

/*
* Maintains the list of containers we manage and fires events when
* they're added and removed.
*/
export default class ContainerIndex extends EventEmitter {
  constructor() {
    super();
    this._docker = new Docker();
    this._containers = new Map();
    this._onContainerChangedListener = this._onContainerChanged.bind(this);
    this._updateTimeout = null;
  }

  get containers() {
    return Array.from(this._containers.values());
  }

  close() {
    this._containers.forEach((container) => {
      container.close();
    });
    this._containers.clear();
  }

  update() {
    clearTimeout(this._updateTimeout);
    return this._docker.listContainers({ all: true })
      .then((allContainers) => {
        const targetContainers = allContainers
          .filter((info) => info.Labels[TARGET_LABEL] === 'true');

        targetContainers
          .filter((info) => !this._containers.get(info.Id))
          .forEach((info) => this._addContainer(info));

        this._containers.forEach((container, id) => {
          if (!targetContainers.some((info) => info.Id === id)) {
            this._removeContainer(container);
          }
        });
      })
      .catch((error) => {
        console.log('Error updating containers:');
        console.log(error.message);
      })
      .finally(() => {
        this._updateTimeout = setTimeout(this.update.bind(this), UPDATE_FREQUENCY);
      });
  }

  getContainer(containerId) {
    const container = this._containers.get(containerId);
    if (!container) {
      throw new Error(`Could not find container ${containerId}`);
    }
    return container;
  }

  _addContainer(info) {
    if (this._containers.has(info.Id)) {
      throw new Error(`Index already contains container ${info.Id}.`);
    }

    const container = new Container(info.Id, info.Names[0]);
    this._containers.set(container.id, container);
    this.emit('containerAdded', container);
    container.on('changed', this._onContainerChangedListener);
  }

  _removeContainer(container) {
    this._containers.delete(container.id);
    container.off('changed', this._onContainerChangedListener);
    this.emit('containerRemoved', container);
    container.close();
  }

  _onContainerChanged(container) {
    this.emit('containerChanged', container);
  }
}
