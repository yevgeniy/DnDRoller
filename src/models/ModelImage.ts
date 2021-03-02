export interface ModelImage {
  id: number;
  name: string;
  created: number;
  keywords?: string[];
  file?: string;
  url?: string;
  data?: string;
  type: "image" | "site";
}
