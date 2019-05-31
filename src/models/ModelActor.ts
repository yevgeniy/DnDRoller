import { ActorSize } from "../enums";
export interface ModelActor {
  id: number;
  hp: number;
  hpCurrent: number;
  initiative: number;
  name: string;
  class: { [k: string]: number };
  race: string;
  size: ActorSize;
}
