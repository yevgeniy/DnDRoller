import { ModelActor } from "../models/ModelActor";
import { ModelInstance } from "../models/ModelInstance";
import ServiceActor from "./ServiceActor";
import ServiceDB from "./ServiceDB";

import "../util/extends";

let ID = 0;
const mockinstance = [
  {
    id: 1,
    name: "forest fight",
    created: +new Date() - 1000 * 60 * 60 * 24 * 3,
    actors: [1, 2]
  },
  {
    id: 2,
    name: "bar fight",
    created: +new Date() + 2,
    actors: [3, 4]
  }
];

let instance: ServiceInstance;
class ServiceInstance {
  record: Record = null;
  serviceActor: ServiceActor = null;

  constructor({ record, serviceActor }) {
    this.record = record;
    this.serviceActor = serviceActor;
  }

  static async init(): Promise<ServiceInstance> {
    if (!instance) {
      instance = new ServiceInstance({
        record: await Record.init(),
        serviceActor: await ServiceActor.init()
      });
    }
    return instance;
  }

  async get(id: number): Promise<ModelInstance> {
    const instance = await this.record.get(id);
    return instance;
  }
  async getAll(): Promise<ModelInstance[]> {
    return await this.record.getAll();
  }
  async createInstance(name: string): Promise<ModelInstance> {
    var newInstance = await this.record.save({
      id: null,
      name: name,
      created: +new Date(),
      actors: []
    });
    console.log("a", newInstance);

    return newInstance;
  }
}

let recordInst;
class Record {
  db: ServiceDB = null;
  constructor({ db }) {}
  static async init(): Promise<Record> {
    if (!recordInst) {
      recordInst = new Record({
        db: await ServiceDB.init()
      });
    }
    return recordInst;
  }
  async get(id: number): Promise<ModelInstance> {
    const all = await this.getAll();
    return all.find(v => v.id === id);
  }
  async getAll(): Promise<ModelInstance[]> {
    await new Promise(res => setTimeout(res, 100));

    return [...mockinstance.map(v => ({ ...v }))];
  }
  async save(instance: ModelInstance): Promise<ModelInstance> {
    await new Promise(res => setTimeout(res, 100));

    if (!instance.id) {
      const max = Math.max(...mockinstance.map(v => v.id));
      instance.id = max + 1;
      mockinstance.push(instance);
    } else {
      var i = mockinstance.findIndex(v => v.id === instance.id);
      mockinstance[i] = instance;
    }
    return { ...instance, actors: [...instance.actors] };
  }
}

export default ServiceInstance;
