export interface ModelActor {
  id: number;
  hp: number;
  hpCurrent: number;
  initiative: number;
  name: string;
  class: { [k: string]: number };
  race: string;
  size: "diminutive" | "tiny" | "small" | "midium" | "large" | "huge";
}
