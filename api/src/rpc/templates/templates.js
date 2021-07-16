/*
* List the current container templates.
*/
async function list(application) {
  return await application.store.getTemplates();
}

export default {
  list,
}