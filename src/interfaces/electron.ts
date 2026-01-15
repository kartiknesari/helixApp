import { Product } from "./products";

export interface IElectronAPI {
    updateWebViewBounds(arg0: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): unknown;
    detachWebView(): unknown;
    attachWebView(arg0: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): unknown;
    getProducts: (personaId: string | null) => Promise<Product[]>;
    getRecommendations: (answers: Record<string, string>) => Promise<Product[]>;

    // --- NEW FUNCTION DEFINITION ---
    getProductById: (id: string) => Promise<Product | null>;
    // resetDatabase: () => any;
}

declare global {
    interface Window {
        database: IElectronAPI;
        electronAPI: IElectronAPI;
    }
}
