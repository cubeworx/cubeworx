import os from 'os';

/*
* Return os info
*/
async function info(application) {
  return {
    arch: os.arch(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    homedir: os.homedir(),
    platform: os.platform(),
    release: os.release(),
    version: os.version(),
    uptime: os.uptime(),
    userInfo: os.userInfo(),
    cpus: os.cpus(),
    networkInterfaces: os.networkInterfaces(),
  };
}

export default {
  info,
}