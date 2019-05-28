import { ModelActor } from "../models/ModelActor";
import ServiceDB from "./ServiceDB";

let ID = 0;
const mockactors: ModelActor[] = [
  {
    id: ++ID,
    class: { Priest: 3 },
    hp: 30,
    hpCurrent: 30,
    initiative: 5,
    name: "Arhail Melil'Il",
    race: "human",
    size: "midium"
  },
  {
    id: ++ID,
    class: { Bard: 3 },
    hp: 20,
    hpCurrent: 20,
    initiative: 15,
    name: "Leshi Gathop",
    race: "dwarf",
    size: "midium"
  }
];

let inst: ServiceActor = null;
class ServiceActor {
  record: Record = null;
  constructor({ record }) {
    this.record = record;
  }
  static async init(): Promise<ServiceActor> {
    if (!inst) {
      inst = new ServiceActor({
        record: await Record.init()
      });
    }
    return inst;
  }

  async get(id: number): Promise<ModelActor> {
    let res = await this.record.getAll();
    return res.find(v => v.id === id);
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
  async save(data: ModelActor) {}
  async getAll(): Promise<ModelActor[]> {
    await new Promise(res => setTimeout(res, 1000));
    return mockactors;
  }
}

export default ServiceActor;
