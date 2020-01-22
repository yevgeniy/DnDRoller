import { ModelActor } from "../models/ModelActor";
import ServiceDB from "./ServiceDB";
import ServiceInstance from "./ServiceInstance";

let ID = 0;
let cacheActors: ModelActor[] = null;

let inst: Promise<ServiceActor> = null;
class ServiceActor {
  record: Record = null;
  serviceInstance: ServiceInstance = null;

  static async init(): Promise<ServiceActor> {
    if (!inst) {
      inst = new Promise(async res => {
        const serv = new ServiceActor();
        serv.record = await Record.init();
        serv.serviceInstance = await ServiceInstance.init();

        res(serv);
      });
    }
    return await inst;
  }

  async get(id: number): Promise<ModelActor> {
    let res = await this.record.getAll();
    return res.find(v => v.id === id);
  }
  async getAll(ids: number[] = null): Promise<ModelActor[]> {
    const res = await this.record.getAll();
    if (!ids) return res;

    return res.filter(v => ids.some(z => v.id === z));
  }
  async getKeyWords(): Promise<string[]> {
    const res = await this.getAll();
    return Array.from(new Set(res.map(v => v.keywords || []).flat()));
  }
  async createActor(name: string): Promise<ModelActor> {
    return await this.record.save({
      id: null,
      class: {},
      hp: null,
      hpCurrent: null,
      initiative: null,
      name: name,
      race: null,
      size: "medium"
    });
  }
  async getForImage(imageId: number): Promise<ModelActor[]> {
    const actors = await this.record.getAll();
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
    await this.record.delete(actorId);
  }
  async save(actor: ModelActor): Promise<ModelActor> {
    return await this.record.save(actor);
  }
  async removeImage(id: number, imageId: number): Promise<ModelActor> {
    let actor = await this.record
      .getAll()
      .then(v => v.find(actor => actor.id === id));
    actor.images = (actor.images || []).filter(v => v !== imageId);
    if (!actor.images.length) delete actor.images;
    await this.record.save(actor);
    return actor;
  }
}

let recordInst;
class Record {
  db: ServiceDB = null;
  constructor({ db }) {
    this.db = db;
  }
  static async init(): Promise<Record> {
    if (!recordInst) {
      recordInst = new Promise(async res => {
        const serv = new Record({
          db: await ServiceDB.init()
        });
        res(serv);
      });
    }
    return await recordInst;
  }
  async save(data: ModelActor): Promise<ModelActor> {
    await new Promise(res => setTimeout(res, 100));
    if (!data.id) {
      const id = Math.max(0, ...cacheActors.map(v => v.id)) + 1;
      data.id = id;
      cacheActors.push(data);
    } else {
      const i = cacheActors.findIndex(v => v.id === data.id);

      cacheActors[i] = data;
    }
    await this.db.save("actor", JSON.stringify(cacheActors));
    return { ...data };
  }
  async getAll(): Promise<ModelActor[]> {
    if (!cacheActors) {
      cacheActors = JSON.parse(await this.db.read("actor"));
    }
    return [...cacheActors];
  }
  async delete(id: number): Promise<void> {
    cacheActors = cacheActors.filter(v => v.id !== id);
    await this.db.save("actor", JSON.stringify(cacheActors));
  }
}

export default ServiceActor;
