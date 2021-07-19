import Docker from 'dockerode';

/*
* Returns information about the currently managed containers.
*/
async function list(application) {
  return application.containerIndex.containers.map((c) => c.getData());
}

/*
* Create a new container.
*/
async function create(application, params) {
  const docker = new Docker();

  params.HostConfig.NetworkMode = application.dockerNetworkName;
  params.Labels = {
    'cbwx.announce.enable': 'true',
  };

  console.log(`Creating container...`);

  const container = await docker.createContainer({
    Image: params.Image,
    Labels: params.Labels || {},
    Env: params.Env || [],
    ExposedPorts: params.ExposedPorts || {},
    HostConfig: params.HostConfig || {}
  });

  await application.containerIndex.update();
  await container.start();
}

/*
* Start a container
*/
async function start(application, params) {
  const container = application.containerIndex.getContainer(params.containerId);
  await container.start();
}

/*
* Stop a container
*/
async function stop(application, params) {
  const container = application.containerIndex.getContainer(params.containerId);
  await container.stop();
}

/*
* Returns the logs for a given container.
*/
async function logs(application, params) {
  const container = application.containerIndex.getContainer(params.containerId);
  return await container.getLogs();
}

export default {
  list,
  create,
  start,
  stop,
  logs,
}
