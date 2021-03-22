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
  images: ModelImage[] = null;

  static async init(): Promise<ServiceImage> {
    if (!inst) {
      inst = new Promise(async res => {
        const serv = new ServiceImage();
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
    return ServiceDB.init().then(v => v.getUrl(file));
  }
  async getAll(ids?: number[]): Promise<ModelImage[]> {
    const res =
      this.images ||
      (this.images = await ServiceDB.init().then(v => v.getImages()));
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
    await ServiceInstance.init()
      .then(v => v.getForImage(imageId))
      .then(instances =>
        instances.map(instance => {
          return ServiceInstance.init().then(v =>
            v.removeImage(instance.id, imageId)
          );
        })
      );
    await ServiceActor.init()
      .then(v => v.getForImage(imageId))
      .then(actors =>
        actors.map(actor => {
          return ServiceInstance.init().then(v =>
            v.removeImage(actor.id, imageId)
          );
        })
      );
    const image = await this.get(imageId);

    if (image.file) await ServiceDB.init().then(v => v.deleteFile(image.file));

    this.images && (this.images = this.images.filter(v => v.id !== imageId));

    await ServiceDB.init().then(v => v.deleteImage(imageId));
  }
  async save(image: ModelImage): Promise<ModelImage> {
    const updatedImage = await ServiceDB.init().then(v => v.saveImage(image));

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

    if (image.file) await ServiceDB.init().then(v => v.deleteFile(image.file));

    const m = file.name.match(/\.\w+?$/);
    const ext = m ? m[0] : "";
    const name = `${+new Date()}_${++ID}${ext}`;
    image.file = name;

    await ServiceDB.init().then(v => v.upload(name, file.data));
    return await this.save(image);
  }
}

export default ServiceImage;
