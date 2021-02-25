import { ModelActor } from "../models/ModelActor";
import ServiceDB from "./ServiceDB";
import ServiceInstance from "./ServiceInstance";

let inst: Promise<ServiceActor> = null;
class ServiceActor {
  serviceInstance: ServiceInstance = null;
  db: ServiceDB = null;

  static async init(): Promise<ServiceActor> {
    if (!inst) {
      inst = new Promise(async res => {
        const serv = new ServiceActor();
        serv.db = await ServiceDB.init();
        serv.serviceInstance = await ServiceInstance.init();

        res(serv);
      });
    }
    return await inst;
  }

  async get(id: number): Promise<ModelActor> {
    let res = await this.getAll();
    return res.find(v => v.id === id);
  }
  async getAll(ids: number[] = null): Promise<ModelActor[]> {
    const res = await this.db.getActors();
    if (!ids) return res;

    return res.filter(v => ids.some(z => v.id === z));
  }
  async getKeyWords(): Promise<string[]> {
    const res = await this.getAll();
    return Array.from(new Set(res.map(v => v.keywords || []).flat()));
  }
  async createActor(name: string): Promise<ModelActor> {
    let newActor: ModelActor = {
      id: null,
      class: {},
      hp: null,
      hpCurrent: null,
      initiative: null,
      name: name,
      race: null,
      size: "medium"
    };
    newActor = await this.save(newActor);
    return newActor;
  }
  async getForImage(imageId: number): Promise<ModelActor[]> {
    const actors = await this.getAll();
    return actors.filter(actor =>
      (actor.images || []).some(v => v === imageId)
    );
  }
  async deleteActor(actorId: number): Promise<void> {
    await this.serviceInstance.getForActor(actorId).then(instances =>
      instances.map(instance => {
        return this.serviceInstance.removeActor(instance.id, actorId);
      })
    );
    await this.db.deleteActor(actorId);
  }
  async save(actor: ModelActor): Promise<ModelActor> {
    return await this.db.saveActor(actor);
  }
  async removeImage(id: number, imageId: number): Promise<ModelActor> {
    let actor = await this.getAll().then(v => v.find(actor => actor.id === id));

    actor.images = (actor.images || []).filter(v => v !== imageId);
    if (!actor.images.length) delete actor.images;
    await this.save(actor);
    return actor;
  }
}

export default ServiceActor;
