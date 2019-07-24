import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import ServiceActor from "../services/ServiceActor";
import ServiceInstance from "../services/ServiceInstance";
import ServiceImage, { File } from "../services/ServiceImage";
import { ModelActor } from "../models/ModelActor";
import { ModelImage } from "../models/ModelImage";
import { ModelInstance } from "../models/ModelInstance";

export function useService(S) {
    const [service, setService] = useState(null);
    useEffect(() => {
        S.init().then(setService);
    }, []);
    return service;
}
export function useInstance(id: number | "empty", history: any = null) {
    const serviceInstance = useService(ServiceInstance);
    const [instance, setInstance] = useState(null);

    useEffect(() => {
        if (!serviceInstance) return;
        if (id === "empty" && history)
            setInstance(
                history.location.state.instance || {
                    id: 0,
                    name: "",
                    create: +new Date(),
                    actors: [],
                    images: []
                }
            );
        else serviceInstance.get(id).then(setInstance);
    }, [serviceInstance, id]);

    async function updateInstance(updateInstance) {
        const newInstance = { ...instance, ...updateInstance };
        /*if instance has an id save it in db*/
        if (newInstance.id) await serviceInstance.save(newInstance);
        /*else save it in history if use backs up*/ else
            history &&
                history.replace(history.location.pathname, {
                    ...(history.location.state || {}),
                    instance: newInstance
                });
        setInstance(newInstance);
    }
    /*save adhock instance in a db*/
    async function createInstance(name: string, data: ModelInstance = null) {
        let newInstance = await serviceInstance.createInstance(name);
        if (data)
            newInstance = await serviceInstance.save({
                ...data,
                id: newInstance.id,
                name: newInstance.name
            });
        /*history should load instance from db now*/
        history &&
            history.replace(history.location.pathname, {
                ...(history.location.state || {}),
                id: newInstance.id,
                instance: null
            });

        setInstance(newInstance);
    }

    return [instance, updateInstance, createInstance];
}
export function useActorIds() {
    const serviceActor = useService(ServiceActor);
    const serviceInstance = useService(ServiceInstance);
    const [actorIds, setActorIds] = useState();

    useEffect(() => {
        if (!serviceActor) return;
        if (!serviceInstance) return;

        serviceActor.getAll().then(res => {
            setActorIds(res.map(v => v.id));
        });
    }, [serviceActor, serviceInstance]);

    async function createActor(name) {
        const newid = (await serviceActor.createActor(name)).id;
        setActorIds([...actorIds, newid]);
    }
    async function deleteActor(id: number) {
        var instances = await serviceInstance.getForActor(id);
        instances.forEach(instance => {
            instance.actors = instance.actors.filter(v => v !== id);
            serviceInstance.save(instance);
        });
        await serviceActor.deleteActor(id);
        setActorIds([...actorIds.filter(v => v !== id)]);
    }

    return [actorIds, createActor, deleteActor];
}
export function useActor(id: number): [ModelActor, (f: ModelActor) => void] {
    const serviceActor = useService(ServiceActor);
    const [actor, setActor] = useState(null);

    useEffect(() => {
        if (!serviceActor) return;
        serviceActor.get(id).then(setActor);
    }, [serviceActor]);

    async function updateActor(updateActor) {
        const newActor = { ...actor, ...updateActor };
        await serviceActor.save(newActor);
        setActor(newActor);
    }

    return [actor, updateActor];
}
export function useImage(id: number) {
    const serviceImage = useService(ServiceImage);
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!serviceImage) return;
        serviceImage.get(id).then(setImage);
    }, [serviceImage]);
    useEffect(() => {
        if (!serviceImage) return;
        if (!image) return;
        if (!image.file && url) {
            setUrl(null);
        } else if (image.file) {
            serviceImage.getUrl(image.file).then(url => setUrl(url));
        }
    }, [image && image.file, serviceImage]);

    async function updateImage(updateImage) {
        const newImage = { ...image, ...updateImage };
        await serviceImage.save(newImage);
        setImage(newImage);
    }
    async function upload(f: File) {
        const newimage = await serviceImage.upload(id, f);
        setImage({ ...newimage });
    }

    return [image, updateImage, upload, url];
}
export function useInstanceIds() {
    const serviceInstance = useService(ServiceInstance);
    const [instanceIds, setInstanceIds] = useState();

    useEffect(() => {
        if (!serviceInstance) return;

        serviceInstance.getAll().then(res => {
            setInstanceIds(res.map(v => v.id));
        });
    }, [serviceInstance]);

    const createInstance = async name => {
        const newid = (await serviceInstance.createInstance(name)).id;
        setInstanceIds([...instanceIds, newid]);
    };
    const deleteInstance = async id => {
        await serviceInstance.deleteInstance(id);
        setInstanceIds([...instanceIds.filter(v => v !== id)]);
    };

    return [instanceIds, createInstance, deleteInstance];
}

export function useImageIds() {
    const serviceImage = useService(ServiceImage);
    const [imageIds, setImageIds] = useState();

    useEffect(() => {
        if (!serviceImage) return;

        serviceImage.getAll().then(res => {
            setImageIds(res.map(v => v.id));
        });
    }, [serviceImage]);

    const createImage = async (name: string, file: File = null) => {
        const newid = (await serviceImage.createImage(name)).id;
        if (file) await serviceImage.upload(newid, file);
        serviceImage.getAll().then(res => {
            setImageIds(res.map(v => v.id));
        });
    };
    const deleteImage = async id => {
        await serviceImage.deleteImage(id);
        setImageIds([...imageIds.filter(v => v !== id)]);
    };

    return [imageIds, createImage, deleteImage];
}
export function useInstanceIdsForActor(id: number) {
    const serviceInstance = useService(ServiceInstance);
    const [instanceIds, setInstanceIds] = useState();

    useEffect(() => {
        if (!serviceInstance) return;

        serviceInstance.getForActor(id).then(res => {
            setInstanceIds(res.map(v => v.id));
        });
    }, [serviceInstance]);

    const attachInstance = async (instanceId: number) => {
        const instance = await serviceInstance.get(instanceId);
        if (instance.actors.indexOf(id) === -1) {
            instance.actors.push(id);
            await serviceInstance.save(instance);
            setInstanceIds([...instanceIds, instanceId]);
        }
    };
    const detatchInstance = async (instanceId: number) => {
        const instance = await serviceInstance.get(instanceId);
        if (instance.actors.indexOf(id) > -1) {
            instance.actors = instance.actors.filter(v => v !== id);
            await serviceInstance.save(instance);
            setInstanceIds([...instanceIds.filter(v => v !== instanceId)]);
        }
    };

    return [instanceIds, attachInstance, detatchInstance];
}
export function useInstanceIdsForImage(id: number) {
    const serviceInstance = useService(ServiceInstance);
    const [instanceIds, setInstanceIds] = useState();

    useEffect(() => {
        if (!serviceInstance) return;

        serviceInstance.getForImage(id).then(res => {
            setInstanceIds(res.map(v => v.id));
        });
    }, [serviceInstance]);

    const attachInstance = async (instanceId: number) => {
        const instance = await serviceInstance.get(instanceId);
        if ((instance.images || []).indexOf(id) === -1) {
            const imgs = instance.images || (instance.images = []);
            imgs.push(id);
            await serviceInstance.save(instance);
            setInstanceIds([...instanceIds, instanceId]);
        }
    };
    const detatchInstance = async (instanceId: number) => {
        const instance = await serviceInstance.get(instanceId);
        if ((instance.images || []).indexOf(id) > -1) {
            instance.images = instance.images.filter(v => v !== id);
            if (instance.images.length === 0) instance.images = null;
            await serviceInstance.save(instance);
            setInstanceIds([...instanceIds.filter(v => v !== instanceId)]);
        }
    };

    return [instanceIds, attachInstance, detatchInstance];
}
export function useActorIdsForImage(id: number) {
    const serviceActor = useService(ServiceActor);
    const [actorIds, setActorIds] = useState();

    useEffect(() => {
        if (!serviceActor) return;

        serviceActor.getForImage(id).then(res => {
            setActorIds(res.map(v => v.id));
        });
    }, [serviceActor]);

    const attachActor = async (actorId: number) => {
        const actor = await serviceActor.get(actorId);
        if ((actor.images || []).indexOf(id) === -1) {
            const imgs = actor.images || (actor.images = []);
            imgs.push(id);
            await serviceActor.save(actor);
            setActorIds([...actorIds, actorId]);
        }
    };
    const detatchActor = async (actorId: number) => {
        const actor = await serviceActor.get(actorId);
        if ((actor.images || []).indexOf(id) > -1) {
            actor.images = actor.images.filter(v => v !== id);
            if (actor.images.length === 0) actor.images = null;
            await serviceActor.save(actor);
            setActorIds([...actorIds.filter(v => v !== actorId)]);
        }
    };

    return [actorIds, attachActor, detatchActor];
}
export function useDiscover(
    discover: number,
    id: number,
    setExpanded: (f: boolean) => void
) {
    const ref = useRef();
    const [discovered, setDiscovered] = useState(false);

    useEffect(() => {
        if (discover !== id) return;
        setExpanded(true);
    }, []);
    useEffect(() => {
        if (discovered) return;
        if (discover !== id) return;
        if (!ref.current) return;
        //@ts-ignore
        ref.current.scrollIntoView();
        setDiscovered(true);
    });

    return ref;
}
export function useHot() {
    const [hot, setHot] = useState(false);

    useEffect(() => {
        if (!hot) return;

        setTimeout(() => setHot(false), 1500);
    }, [hot]);

    return { hot, setHot };
}
