import * as React from "react";
import {
  useCallback,
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef
} from "react";
import ServiceActor from "../services/ServiceActor";
import ServiceInstance from "../services/ServiceInstance";
import ServiceImage, { File } from "../services/ServiceImage";
import { ModelActor } from "../models/ModelActor";
import { ModelInstance } from "../models/ModelInstance";
import { RouterContextView } from "./routerContext";

export function useDiscover(doDiscover: boolean, wasDiscovered: () => void) {
  const ref = useRef();

  useEffect(() => {
    if (!doDiscover) return;
    //@ts-ignore
    ref.current.scrollIntoView();
    wasDiscovered();
  }, [ref.current, doDiscover]);

  return ref;
}

const _historyState = [];
export function useHistoryState(id, initialstate) {
  const key = "asdfasdfasdf";
  let historyentry = _historyState.find(v => v.key === key);
  if (!historyentry) {
    historyentry = {
      key: key,
      state: {}
    };
    _historyState.push(historyentry);
  }
  const [state, setState] = useState(
    historyentry[id] || (historyentry[id] = initialstate)
  );
  const updateState = u => {
    historyentry[id] = {
      ...historyentry[id],
      ...u
    };
    setState(historyentry[id]);
  };
  return { state, updateState };
}

export function useService(S) {
  const [service, setService] = useState(null);
  useEffect(() => {
    S.init().then(setService);
  }, []);
  return service;
}
export function useInstance(id: number | "empty", history: any = null) {
  const serviceInstance = useService(ServiceInstance);
  const serviceActor = useService(ServiceActor);
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
    else {
      /*else save it in history if use backs up*/
      history &&
        history.replace(history.location.pathname, {
          ...(history.location.state || {}),
          instance: newInstance
        });
    }
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
  async function cloneActor(actor: ModelActor) {
    let newactor = await serviceActor.createActor(`${actor.name} -- Clone`);
    let name, id;
    await serviceActor.save({ ...actor, name: newactor.name, id: newactor.id });
    const newinstance = await serviceInstance.save({
      ...instance,
      actors: [...instance.actors, newactor.id]
    });

    setInstance(newinstance);
  }

  return [instance, updateInstance, createInstance, cloneActor];
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
  async function cloneActor(actor: ModelActor) {
    let newactor = await serviceActor.createActor(`${actor.name} -- Clone`);
    await serviceActor.save({ ...actor, name: newactor.name, id: newactor.id });
    setActorIds([...actorIds, newactor.id]);
  }

  return [actorIds, createActor, deleteActor, cloneActor];
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

  return { image, updateImage, upload, url };
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
  const cloneInstance = async (instance: ModelInstance) => {
    const newinstance = await serviceInstance.createInstance(
      `${instance.name} -- Clone`
    );
    await serviceInstance.save({
      ...instance,
      name: newinstance.name,
      id: newinstance.id
    });
    setInstanceIds([...instanceIds, newinstance.id]);
  };

  return { instanceIds, createInstance, deleteInstance, cloneInstance };
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
  const serviceActor = useService(ServiceActor);
  const [instanceIds, setInstanceIds] = useState();

  useEffect(() => {
    if (!serviceInstance) return;

    serviceInstance.getForActor(id).then(res => {
      setInstanceIds(res.map(v => v.id));
    });
  }, [serviceInstance]);

  const _setInstanceIds = async (instanceIds: number[]) => {
    let instances = Array.from(
      new Set([
        ...(await serviceInstance.getForActor(id)),
        ...(await serviceInstance.getAll(instanceIds))
      ])
    );

    const proms = instances.map(instance => {
      instance.actors = (instance.actors || []).filter(v => v !== id);
      if (instanceIds.some(v => instance.id === v)) instance.actors.push(id);
      return serviceInstance.save(instance);
    });
    await Promise.all(proms);

    setInstanceIds([...instanceIds]);
  };

  return {
    instanceIds,
    setInstanceIds: _setInstanceIds
  };
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

  const setInstances = async (instanceIds: number[]) => {
    let instances = Array.from(
      new Set([
        ...(await serviceInstance.getForImage(id)),
        ...(await serviceInstance.getAll(instanceIds))
      ])
    );

    const proms = instances.map(instance => {
      instance.images = (instance.images || []).filter(v => v !== id);
      if (instanceIds.some(v => instance.id === v)) instance.images.push(id);
      return serviceInstance.save(instance);
    });
    await Promise.all(proms);

    setInstanceIds([...instanceIds]);
  };
  return { instanceIds, setInstances };
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

  const setActors = async (actorIds: number[]) => {
    let actors = Array.from(
      new Set([
        ...(await serviceActor.getForImage(id)),
        ...(await serviceActor.getAll(actorIds))
      ])
    );

    const proms = actors.map(actor => {
      actor.images = (actor.images || []).filter(v => v !== id);
      if (actorIds.some(v => actor.id === v)) actor.images.push(id);
      return serviceActor.save(actor);
    });
    await Promise.all(proms);

    setActorIds([...actorIds]);
  };

  return { actorIds, setActors };
}

export function useHot() {
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!hot) return;

    setTimeout(() => setHot(false), 1500);
  }, [hot]);

  return { hot, setHot };
}
export function useModalState<T>(def: boolean = false) {
  const [isOpen, setIsOpen] = useState(def);
  const prom = useRef(null);

  const doOpen = () => {
    setIsOpen(true);
    return new Promise<T>(res => {
      prom.current = res;
    });
  };
  const doClose = () => {
    prom.current && prom.current(null);
    setIsOpen(false);
  };
  const onDone = (res: T) => {
    prom.current && prom.current(res);
    setIsOpen(false);
  };

  return { isOpen, doOpen, doClose, onDone };
}
