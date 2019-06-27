import { ActorSize } from "../enums";
export interface ModelActor {
    id: number;
    hp: number;
    isTemplate?: boolean;
    hpCurrent: number;
    initiative: number;
    name: string;
    class: { [k: string]: number };
    race: string;
    size: ActorSize;
    images?: number[];
}
