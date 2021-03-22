import { ModelActor } from "../models/ModelActor";
import ServiceDB from "./ServiceDB";
import ServiceInstance from "./ServiceInstance";

let inst: Promise<ServiceActor> = null;
class ServiceActor {
  actors: ModelActor[] = null;

  static async init(): Promise<ServiceActor> {
    if (!inst) {
      inst = new Promise(async res => {
        const serv = new ServiceActor();
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
    const res =
      this.actors ||
      (this.actors = await ServiceDB.init().then(v => v.getActors()));
    if (!ids) return res;

    return res.filter(v => ids.some(z => v.id === z));
  }
  async cloneTemplates(actorIds: number[]): Promise<number[]> {
    const prospectiveActors = await this.getAll(actorIds);
    const res = [];
    for (let actor of prospectiveActors) {
      if (actor.isTemplate)
        res.push(await this.cloneActorFrom(actor).then(v => v.id));
      else res.push(actor.id);
    }

    return res;
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
    this.actors.push(newActor);
    return newActor;
  }
  async cloneActorFrom(actor: ModelActor): Promise<ModelActor> {
    const predicate = actor.name.match(/([\w\W]*?)\d*?$/)[1];
    const counts = await this.getAll()
      .then(actors =>
        actors.filter(v => v.name.match(new RegExp(`^${predicate}`)))
      )
      .then(v => v.length);

    let newactor = await this.save({
      ...actor,
      isTemplate: false,
      name: predicate + counts,
      id: undefined,
      //@ts-ignore
      _id: undefined
    });

    this.actors.push(newactor);

    return newactor;
  }
  async getForImage(imageId: number): Promise<ModelActor[]> {
    const actors = await this.getAll();
    return actors.filter(actor =>
      (actor.images || []).some(v => v === imageId)
    );
  }
  async deleteActor(actorId: number): Promise<void> {
    await ServiceInstance.init()
      .then(v => v.getForActor(actorId))
      .then(instances =>
        instances.map(instance => {
          return ServiceInstance.init().then(v =>
            v.removeActor(instance.id, actorId)
          );
        })
      );

    this.actors = this.actors.filter(v => v.id !== actorId);

    await ServiceDB.init().then(v => v.deleteActor(actorId));
  }
  async deleteActors(actorIds: number[]): Promise<void> {
    for (let id of actorIds) await this.deleteActor(id);
  }
  async save(actor: ModelActor): Promise<ModelActor> {
    const updatedActor = await ServiceDB.init().then(v => v.saveActor(actor));

    this.actors = this.actors.map(v => {
      if (v.id === updatedActor.id)
        return {
          ...v,
          ...updatedActor
        };
      return v;
    });

    return updatedActor;
  }
  async removeImage(id: number, imageId: number): Promise<ModelActor> {
    let actor = await this.get(id);

    actor.images = (actor.images || []).filter(v => v !== imageId);
    if (!actor.images.length) delete actor.images;
    await this.save(actor);
    return actor;
  }
  async getFreeActorIds(): Promise<number[]> {
    const actors = await this.getAll();
    const res = [];

    for (let actor of actors) {
      const instancesForActor = await ServiceInstance.init().then(v =>
        v.getForActor(actor.id)
      );
      if (instancesForActor.length) res.push(actor.id);
    }
    console.log(res);

    return res;
  }
}

export default ServiceActor;
