export interface ModelImage {
  id: number;
  name: string;
  created: number;
  keywords?: string[];
  file?: string;
  url?: string;
  text?: string;
  type: "image" | "site" | "text" | "filter";
}
