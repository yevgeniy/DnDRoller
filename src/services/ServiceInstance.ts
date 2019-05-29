import { ModelActor } from "../models/ModelActor";
import { ModelInstance } from "../models/ModelInstance";
import ServiceActor from "./ServiceActor";
import ServiceDB from "./ServiceDB";

import "../util/extends";

let ID = 0;
const mockinstance = [
  {
    id: ++ID,
    name: "forest fight",
    datetime: +new Date(),
    actors: [1, 2]
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
  async save(data: ModelInstance) {}
  async get(id: number): Promise<ModelInstance> {
    const all = await this.getAll();
    return all.find(v => v.id === id);
  }
  async getAll(): Promise<ModelInstance[]> {
    await new Promise(res => setTimeout(res, 100));

    return [...mockinstance.map(v => ({ ...v }))];
  }
}

export default ServiceInstance;
