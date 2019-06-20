import { ModelImage } from "../models/ModelImage";
import ServiceDB from "./ServiceDB";

export interface File {
    name: string;
    data: string | ArrayBuffer;
}

let ID = 0;
let cacheImages: ModelImage[] = null;
let cacheKeywords: string[] = [];

let inst: ServiceImage = null;
class ServiceImage {
    record: Record = null;
    constructor({ record }) {
        this.record = record;
    }
    static async init(): Promise<ServiceImage> {
        if (!inst) {
            inst = new ServiceImage({
                record: await Record.init()
            });
        }
        return inst;
    }

    async get(id: number): Promise<ModelImage> {
        let res = await this.record.getAll();
        return res.find(v => v.id === id);
    }
    async getAll(): Promise<ModelImage[]> {
        return await this.record.getAll();
    }
    async createImage(name: string): Promise<ModelImage> {
        return await this.record.save({
            id: null,
            name: name,
            created: +new Date(),
            keywords: null
        });
    }
    async deleteImage(id: number): Promise<void> {
        await this.record.delete(id);
    }
    async save(image: ModelImage): Promise<ModelImage> {
        return await this.record.save(image);
    }
    async upload(id: number, file: File): Promise<ModelImage> {
        const image = await this.record
            .getAll()
            .then(async v => v.find(v => v.id === id));

        if (image.file) await this.record.deleteImg(image.file);

        const m = file.name.match(/\.\w+?$/);
        const ext = m ? m[0] : "";
        const name = `${+new Date()}_${++ID}${ext}`;
        image.file = name;

        await this.record.upload(name, file.data);
        return await this.save(image);
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
    async upload(name: string, data: string | ArrayBuffer): Promise<void> {
        await this.db.upload(name, data);
    }
    async deleteImg(name: string): Promise<void> {
        await this.db.deleteImg(name);
    }
    async save(data: ModelImage): Promise<ModelImage> {
        if (!data.id) {
            const id = Math.max(0, ...cacheImages.map(v => v.id)) + 1;
            data.id = id;
            cacheImages.push(data);
        } else {
            const i = cacheImages.findIndex(v => v.id === data.id);

            cacheImages[i] = data;
        }
        await this.db.save("image", JSON.stringify(cacheImages));
        return { ...data };
    }
    async getAll(): Promise<ModelImage[]> {
        if (!cacheImages) {
            cacheImages = JSON.parse(await this.db.read("image"));
            cacheKeywords = cacheImages
                .map(v => v.keywords || [])
                .reduce((p, c) => [
                    ...p,
                    ...p.filter(v => p.indexOf(v) === -1)
                ]);
        }
        return [...cacheImages];
    }
    async delete(id: number): Promise<void> {
        cacheImages = cacheImages.filter(v => v.id !== id);
        await this.db.save("image", JSON.stringify(cacheImages));

        cacheKeywords = cacheImages
            .map(v => v.keywords || [])
            .reduce((p, c) => [...p, ...p.filter(v => p.indexOf(v) === -1)]);
    }
}

export default ServiceImage;
