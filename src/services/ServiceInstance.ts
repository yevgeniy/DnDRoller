import { ModelActor } from "../models/ModelActor";
import { ModelInstance } from "../models/ModelInstance";
import ServiceActor from "./ServiceActor";
import ServiceDB from "./ServiceDB";

import "../util/extends";

let ID = 0;
let cacheInstance: ModelInstance[] = null;

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
    async getForActor(id: number): Promise<ModelInstance[]> {
        /*
        db.players.find( { $where: function() {
          return (hex_md5(this.name) == "9b53e667f30cd329dca1ec9e6a83e994")
        } } );
    */
        return await this.record
            .getAll()
            .then(v => v.filter(z => z.actors.some(a => a === id)));
    }
    async getForImage(id: number): Promise<ModelInstance[]> {
        return await this.record
            .getAll()
            .then(v => v.filter(z => (z.images || []).some(a => a === id)));
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
        return newInstance;
    }
    async deleteInstance(id: number): Promise<void> {
        await this.record.delete(id);
    }
    async save(instance: ModelInstance): Promise<ModelInstance> {
        return await this.record.save(instance);
    }
    async removeActor(id: number, actorId: number): Promise<ModelInstance> {
        let instance = await this.record.get(id);
        instance.actors = instance.actors.filter(v => v !== actorId);
        await this.record.save(instance);
        return instance;
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
    async get(id: number): Promise<ModelInstance> {
        const all = await this.getAll();
        return all.find(v => v.id === id);
    }
    async getAll(): Promise<ModelInstance[]> {
        if (!cacheInstance) {
            var data = await this.db.read("instance");
            cacheInstance = JSON.parse(data);
        }
        return cacheInstance;
    }
    async save(instance: ModelInstance): Promise<ModelInstance> {
        if (!instance.id) {
            const max = Math.max(0, ...cacheInstance.map(v => v.id));
            instance.id = max + 1;
            cacheInstance.push(instance);
        } else {
            var i = cacheInstance.findIndex(v => v.id === instance.id);
            cacheInstance[i] = instance;
        }
        await this.db.save("instance", JSON.stringify(cacheInstance));
        return { ...instance, actors: [...instance.actors] };
    }
    async delete(id: number): Promise<void> {
        cacheInstance = cacheInstance.filter(v => v.id !== id);
        await this.db.save("instance", JSON.stringify(cacheInstance));
    }
}

export default ServiceInstance;
