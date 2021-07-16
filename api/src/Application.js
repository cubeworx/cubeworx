import Docker from 'dockerode';
import express from 'express';
import { Server } from 'socket.io';
import Tracker from './Tracker.js';
import Store from './Store.js';
import rpc from './rpc/rpc.js'

/*
* Top level application.
*/
export default class Application {
  constructor(listenPort) {
    this._listenPort = listenPort;
    this._router = express.Router();
    this._docker = new Docker();
    this._io = null;
    this._dockerNetworkName = null;
    this._store = null;
    this._tracker = null;
    this._createRoutes();
  }

  get router() {
    return this._router;
  }

  get dockerNetworkName() {
    return this._dockerNetworkName;
  }

  get store() {
    if (!this._store) {
      throw new Error('Store unavailable.');
    }
    return this._store;
  }

  get containerIndex() {
    if (!this._tracker) {
      throw new Error('Container tracker unavailable.');
    }
    return this._tracker.containerIndex;
  }

  attach(httpServer) {
    this._io = new Server();
    this._io.attach(httpServer);
    this._io.on('connection', this._onServerConnection.bind(this));
  }

  async start() {
    console.log(`Searching for our container...`);
    const info = await this._findRunningContainerWithPublicPort(this._listenPort);
    if (!info) {
      throw new Error(`Failed to find our container using public port binding [${this._listenPort}].`);
    }

    const dockerContainerName = info.Names[0].replace(/^\/+/, '');
    console.log(`Found public port [${this._listenPort}] bound to container [${dockerContainerName}].`);
    console.log(`Assuming container [${dockerContainerName}] is our container.`);

    const networks = Object.keys(info.NetworkSettings.Networks);
    if (networks.length === 0) {
      throw new Error(`Failed to find a network to use on container [${dockerContainerName}].`);
    }

    if (networks.length > 1) {
      console.log(`Warning: found multiple networks on container [${dockerContainerName}].`);
    }

    this._dockerNetworkName = networks[0];
    console.log(`Using network [${this._dockerNetworkName}] from container [${dockerContainerName}].`);

    this._store = new Store();
    await this._store.initialize();

    this._tracker = new Tracker(this._listenPort, this._io);
  }

  close() {
    if (this._tracker) {
      this._tracker.close();
      this._tracker = null;
    }
    if (this._io) {
      this._io.close();
      this._io = null;
    }
  }

  _createRoutes() {
    this._router.get('/', async (req, res) => {
      res.send(`CubeWorx ${new Date()}`);
    });
    
    this._router.post('/rpc', (req, res, next) => {
      const JSON_RPC_VERSION = '2.0';
      const request = req.body;
      if (request.jsonrpc !== JSON_RPC_VERSION) {
        throw new Error('Invalid JSONRPC version.')
      }

      const paths = request.method.split('.');
      let location = rpc;

      while (paths.length > 0) {
        const token = paths.shift();
        location = location[token];
        if (!location) {
          throw new Error(`Failed to resolve [${token}] in method [${request.method}]`);
        }
      }
      
      if (typeof location !== 'function') {
        throw new Error(`Resolved [${request.method}] to type '${typeof location}' rather than a function.`);
      }

      console.log(`Executing RPC ${request.method}`);
    
      location(this, request.params)
        .then((result) => {
          res.json({
            jsonrpc: JSON_RPC_VERSION,
            result: result || {},
            id: request.id
          });
        })
        .catch((error) => {
          console.log(`Error while executing RPC method [${request.method}]`);
          next(error);
        });
    });
  }

  async _findRunningContainerWithPublicPort(targetPort) {
    const containerList = await this._docker.listContainers();
    return containerList.find((info) => {
      return info.Ports && info.Ports.some((p) => p.PublicPort === targetPort && p.PublicPort === p.PrivatePort && p.Type === 'udp');
    });
  }

  _onServerConnection() {
    console.log('Client connected to API socket.');
  }
}
