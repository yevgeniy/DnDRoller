import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import ServiceActor from "../services/ServiceActor";
import ServiceInstance from "../services/ServiceInstance";
import { ModelActor } from "../models/ModelActor";
import { ModelInstance } from "../models/ModelInstance";

export function useService(S) {
  const [service, setService] = useState(null);
  useEffect(() => {
    S.init().then(setService);
  }, []);
  return service;
}
export function useInstance(id: number | "empty", history: any) {
  const serviceInstance = useService(ServiceInstance);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!serviceInstance) return;
    if (id === "empty")
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
export function useActor(id: number): [ModelActor, (f: ModelActor) => void] {
  const serviceActor = useService(ServiceActor);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    if (!serviceActor) return;
    serviceActor.get(id).then(setActor);
  }, [serviceActor]);

  function updateActor(updateActor) {
    setActor({ ...actor, ...updateActor });
  }

  return [actor, updateActor];
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
