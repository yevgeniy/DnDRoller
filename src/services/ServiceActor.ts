import { ModelActor } from "../models/ModelActor";
import ServiceDB from "./ServiceDB";

let ID = 0;
let cacheActors: ModelActor[] = null;

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
    async getAll(): Promise<ModelActor[]> {
        return await this.record.getAll();
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
    async deleteActor(id: number): Promise<void> {
        await this.record.delete(id);
    }
    async save(actor: ModelActor): Promise<ModelActor> {
        return await this.record.save(actor);
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
            recordInst = new Record({
                db: await ServiceDB.init()
            });
        }
        return recordInst;
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
