export interface ModelInstance {
  id: number;
  name: string;
  isTemplate?: boolean;
  created: number;
  actors: number[];
  images?: number[];
  keywords?: string[];
}
