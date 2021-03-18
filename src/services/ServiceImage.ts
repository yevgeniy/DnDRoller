import { ModelImage } from "../models/ModelImage";
import ServiceDB from "./ServiceDB";
import ServiceActor from "./ServiceActor";
import ServiceInstance from "./ServiceInstance";

export interface File {
  name: string;
  data: string | ArrayBuffer;
}

let ID = 0;

let inst: Promise<ServiceImage> = null;
class ServiceImage {
  serviceActor: ServiceActor = null;
  serviceInstance: ServiceInstance = null;
  db: ServiceDB = null;

  images: ModelImage[] = null;

  static async init(): Promise<ServiceImage> {
    if (!inst) {
      inst = new Promise(async res => {
        const serv = new ServiceImage();
        serv.serviceActor = await ServiceActor.init();
        serv.serviceInstance = await ServiceInstance.init();
        serv.db = await ServiceDB.init();
        res(serv);
      });
    }

    return inst;
  }

  async get(id: number): Promise<ModelImage> {
    let res = await this.getAll();

    const img = res.find(v => v.id === id);
    if (!img) return null;

    img.type = img.type || "image";
    return img;
  }
  async getUrl(file: string): Promise<string> {
    return this.db.getUrl(file);
  }
  async getAll(ids?: number[]): Promise<ModelImage[]> {
    const res = this.images || (this.images = await this.db.getImages());
    if (!ids) return res;

    console.log("IDS:", ids);
    return res.filter(v => ids.indexOf(v.id) > -1);
  }
  async getKeyWords(): Promise<string[]> {
    const res = await this.getAll();
    return Array.from(new Set(res.map(v => v.keywords || []).flat()));
  }
  async createImage(name: string): Promise<ModelImage> {
    const img = await this.save({
      id: null,
      name: name,
      created: +new Date(),
      keywords: null,
      type: "image"
    });
    this.images && this.images.push(img);
    return img;
  }
  async deleteImage(imageId: number): Promise<void> {
    await this.serviceInstance.getForImage(imageId).then(instances =>
      instances.map(instance => {
        return this.serviceInstance.removeImage(instance.id, imageId);
      })
    );
    await this.serviceActor.getForImage(imageId).then(actors =>
      actors.map(actor => {
        return this.serviceActor.removeImage(actor.id, imageId);
      })
    );
    const image = await this.get(imageId);

    if (image.file) await this.db.deleteFile(image.file);

    this.images && (this.images = this.images.filter(v => v.id !== imageId));

    await this.db.deleteImage(imageId);
  }
  async save(image: ModelImage): Promise<ModelImage> {
    const updatedImage = await this.db.saveImage(image);

    this.images &&
      (this.images = this.images.map(v => {
        if (v.id === image.id)
          return {
            ...v,
            ...updatedImage
          };
        else return v;
      }));

    return updatedImage;
  }
  async upload(id: number, file: File): Promise<ModelImage> {
    const image = await this.get(id);

    if (image.file) await this.db.deleteFile(image.file);

    const m = file.name.match(/\.\w+?$/);
    const ext = m ? m[0] : "";
    const name = `${+new Date()}_${++ID}${ext}`;
    image.file = name;

    await this.db.upload(name, file.data);
    return await this.save(image);
  }
}

export default ServiceImage;
