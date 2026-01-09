// This file provides TypeScript definitions for the API exposed by the preload script.
// It is not imported anywhere but is picked up by the TypeScript compiler
// because of the `include` settings in `tsconfig.json`.

export interface Persona {
  id: string;
  name: string;
  theme_color: string;
  screensaver_path: string;
}

export interface ProductSpec {
  id: number;
  label: string;
  human_value: string;
  tech_value: string | null;
  icon_name: string;
}

export interface ProductMedia {
  id: number;
  media_type: string;
  file_path: string;
  display_order: number;
  is_hero_media: number;
}

export interface Product {
  id: string;
  model_name: string;
  hero_description: string;
  is_featured: number;
  persona: Persona | null;
  media: ProductMedia[];
  specs: ProductSpec[];
}

export interface IElectronAPI {
  getProducts: (personaId?: string) => Promise<Product[]>;
  getRecommendations: (answers: Record<string, string>) => Promise<Product[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
