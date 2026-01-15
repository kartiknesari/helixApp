import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
    getProductById,
    getProducts,
    getRecommendations,
    setupDatabase,
    seedDatabase,
    getSqlite3,
} from "#/model";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    // Test active push message to Renderer-process.
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString()
        );
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(async () => {
    try {
        console.log("Initializing Database.");
        const db = getSqlite3();
        await setupDatabase(db);
        console.log("Database initialized.");

        // Seed it (This runs your 'Clear Old Data' logic)
        const result = db
            .prepare("SELECT COUNT(*) as count FROM products")
            .get() as { count: number };
        const productCount = result.count || 0;

        if (productCount === 0) {
            console.log("Seeding Database.");
            await seedDatabase(db)
                .then()
                .catch((error) =>
                    console.error("Error Seeding Database", error)
                );
            console.log("Database seeded successfully.");
        } else {
            console.log("Database already contains data. Skipping seed.");
        }
    } catch (err) {
        console.error("Failed to setup database:", err);
        app.quit();
        return;
    }

    // 2. Register API Handlers
    ipcMain.handle("get-products", (_event, personaId?: string) => {
        try {
            return getProducts(personaId);
        } catch (error) {
            console.error("Failed to get products:", error);
            return [];
        }
    });

    ipcMain.handle(
        "get-recommendations",
        (_event, answers: Record<string, string>) => {
            try {
                return getRecommendations(answers);
            } catch (error) {
                console.error("Failed to get recommendations:", error);
                return [];
            }
        }
    );

    // --- HANDLER FOR PRODUCT DETAIL ---
    ipcMain.handle("get-product-by-id", (_event, productId: string) => {
        try {
            return getProductById(productId);
        } catch (error) {
            console.error("Failed to get product detail:", error);
            return null;
        }
    });

    createWindow();
});
