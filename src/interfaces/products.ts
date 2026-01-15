import { Persona } from "./persona";

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

export interface PDPSection {
    id: number;
    product_id: string;
    section_type: string;
    title: string;
    description: string;
    media_path: string;
    layout_config: {
        span?: "small" | "medium" | "large" | "full";
        align?: "left" | "right" | "center";
        theme?: "light" | "dark" | "glass";
    };
    display_order: number;
}

export interface Product {
    id: string;
    model_name: string;
    hero_description: string;
    is_featured: number;
    persona: Persona | null;
    media: ProductMedia[];
    specs: ProductSpec[];
    pdp_sections: PDPSection[];
    url: string; // New field
}
