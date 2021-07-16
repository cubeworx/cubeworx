/*
* Do our best to parse the Bedrock 'Server Id' string. Note, this format
* is essentially unparsable in certain situations where the MOTD utilizes
* semicolons and digits. Should not fail in normal use.
* https://wiki.vg/Raknet_Protocol#Unconnected_Pong
*/
export default function parseServerId(serverId) {
  const result = serverId.match(/^(?<edition>(?:MCPE|MCEE))\;(?<motd1>.+)\;(?<protocol>\d+)\;(?<version>[\d\.]+)\;(?<playerCount>\d+)\;(?<maxPlayerCount>\d+)\;(?<serverId>\d+)\;(?<motd2>.+)\;(?<mode>.+)\;(?<modeNumeric>\d+)\;(?<portv4>\d+)\;(?<portv6>\d+)\;$/);
  return result ? result.groups : null;
}
