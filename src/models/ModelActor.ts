export interface ModelActor {
  id: number;
  hp: number;
  hpMax: number;
  name: string;
  class: { [k: string]: number };
  race: string;
  size: "diminutive" | "tiny" | "small" | "midium" | "large" | "huge";
}
