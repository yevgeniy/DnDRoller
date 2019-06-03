import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import ServiceActor from '../services/ServiceActor';
import ServiceInstance from '../services/ServiceInstance';
import {ModelActor} from '../models/ModelActor';

export function useService(S) {
  const [service, setService] = useState(null);
  useEffect(() => {
    S.init().then(setService);
  }, []);
  return service;
}
export function useActor(id: number)
    : [ModelActor, (f:ModelActor)=>void] {
      
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
