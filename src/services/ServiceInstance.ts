import { ModelActor } from "../models/ModelActor";
import { ModelInstance } from "../models/ModelInstance";
import ServiceDB from "./ServiceDB";

import "../util/extends";
import { genId } from "../util";

let cacheInstance: ModelInstance[] = null;

let instance: Promise<ServiceInstance>;
class ServiceInstance {
  db: ServiceDB = null;

  constructor() {}

  static async init(): Promise<ServiceInstance> {
    if (!instance)
      instance = new Promise(async res => {
        const serv = new ServiceInstance();
        serv.db = await ServiceDB.init();
        res(serv);
      });

    return await instance;
  }

  async get(id: number): Promise<ModelInstance> {
    const instance = (await this.getAll()).find(v => v.id === id);
    return instance;
  }
  async getForActor(id: number): Promise<ModelInstance[]> {
    /*
        db.players.find( { $where: function() {
          return (hex_md5(this.name) == "9b53e667f30cd329dca1ec9e6a83e994")
        } } );
    */
    return await this.getAll().then(v =>
      v.filter(z => (z.actors || []).some(a => a === id))
    );
  }
  async getForImage(id: number): Promise<ModelInstance[]> {
    return await this.getAll().then(v =>
      v.filter(z => (z.images || []).some(a => a === id))
    );
  }
  async getAll(ids = null): Promise<ModelInstance[]> {
    const res = await this.db.getInstances();
    if (!ids) return res;
    return res.filter(v => ids.some(z => z === v.id));
  }
  async getKeyWords(): Promise<string[]> {
    const res = await this.getAll();
    return Array.from(new Set(res.map(v => v.keywords || []).flat()));
  }
  async createInstance(name: string): Promise<ModelInstance> {
    var newInstance = await this.save({
      id: null,
      name: name,
      created: +new Date(),
      actors: []
    });
    return newInstance;
  }
  async deleteInstance(id: number): Promise<void> {
    await this.db.deleteInstace(id);
  }
  async save(instance: ModelInstance): Promise<ModelInstance> {
    return await this.db.saveInstance(instance);
  }
  async removeActor(id: number, actorId: number): Promise<ModelInstance> {
    let instance = await this.get(id);
    instance.actors = instance.actors.filter(v => v !== actorId);
    await this.save(instance);
    return instance;
  }
  async removeImage(id: number, imageId: number): Promise<ModelInstance> {
    let instance = await this.get(id);
    instance.images = (instance.images || []).filter(v => v !== imageId);
    if (!instance.images.length) delete instance.images;
    await this.save(instance);
    return instance;
  }
}

export default ServiceInstance;
