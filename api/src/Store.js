import Datastore from 'nedb-promises';
import fs from 'fs';
import path from 'path';

const TEMPLATES_DB_PATH = '/data/templates.db';
const TEMPLATES_ASSETS_PATH = 'assets/templates';

/*
* Persistent storage
*/
export default class Store {
  constructor() {
    // if (fs.existsSync(TEMPLATES_DB_PATH)) {
    //   fs.unlinkSync(TEMPLATES_DB_PATH);
    // }
    this._templatesDatastore = Datastore.create(TEMPLATES_DB_PATH);
  }

  async initialize() {
    const templates = await this.getTemplates();
    if (templates.length === 0) {
      console.log('Initializing templates:');
      const templateFiles = await fs.promises.readdir(TEMPLATES_ASSETS_PATH);
      for (const templateFile of templateFiles) {
        const templatePath = path.join(TEMPLATES_ASSETS_PATH, templateFile);
        console.log(`Adding template [${templatePath}]`);
        const data = await fs.promises.readFile(templatePath);
        const template = JSON.parse(data);
        await this._templatesDatastore.insert(template);
      }
    }
  }

  async getTemplates() {
    return await this._templatesDatastore.find({});
  }
}
