import parseServerId from './utilities/parseServerId.js'

/*
* Represents the data returned in an 'unconnected pong' packet from
* a single Bedrock server.
*/
export default class BedrockPong {
  constructor(serverGuid, serverMagic, serverId) {
    this._serverGuid = serverGuid;
    this._serverMagic = serverMagic;
    this._serverId = serverId;
    this._properties = parseServerId(this.serverId);
  }

  get serverGuid() {
    return this._serverGuid;
  }

  get serverMagic() {
    return this._serverMagic;
  }

  get serverId() {
    return this._serverId;
  }

  get properties() {
    return this._properties;
  }

  equalTo(other) {
    return JSON.stringify(this) === JSON.stringify(other);
  }  
}