import { fileURLToPath } from "node:url";
import path from "path";
import fs from "fs";
import { app } from "electron";
// import { readFileSync } from "fs";
import { createRequire } from "node:module";
import type Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create require function for ES modules
const require = createRequire(import.meta.url);
let DB: typeof Database;
try {
    if (app.isPackaged) {
        // Point to the unpacked location
        const unpackedPath = path.join(
            process.resourcesPath,
            "app.asar.unpacked",
            "node_modules",
            "better-sqlite3"
        );

        console.log("Loading better-sqlite3 from:", unpackedPath);
        DB = require(unpackedPath) as typeof Database;
    } else {
        DB = require("better-sqlite3") as typeof Database;
    }
} catch (error) {
    console.error("Failed to load better-sqlite3:", error);
    // Fallback to regular require
    DB = require("better-sqlite3") as typeof Database;
}

// const DB = require("better-sqlite3") as typeof Database;

const root = path.join(__dirname, "..");
// const TAG = "[better-sqlite3]";

// 1. Path determination
const dbPath = app.isPackaged
    ? path.join(app.getPath("userData"), "v5_retail.db")
    : path.join(__dirname, "../v5_retail.db");

// Path to bundled seed database (COMMENTED OUT)
// const seedDbPath = app.isPackaged
//     ? path.join(process.resourcesPath, "seed.db")
//     : path.join(__dirname, "../../resources/seed.db");

let dbInstance: Database.Database | null = null;

function fetchFile(filePath: string): any[][] {
    // try {
    //     const resolvedPath = app.isPackaged
    //         ? path.join(process.resourcesPath, filePath)
    //         : path.join(__dirname, "../backend", filePath);

    //     console.log(`Reading JSON file from: ${resolvedPath}`);

    //     if (!fs.existsSync(resolvedPath)) {
    //         console.error(`File not found: ${resolvedPath}`);
    //         return [];
    //     }
    //     // const absolutePath = path.resolve(__dirname, filePath);
    //     const res = readFileSync(resolvedPath, "utf-8");
    //     return JSON.parse(res);
    // } catch (error) {
    //     console.error(`Error in fetching file '${filePath}': `, error);
    //     return [];
    // }
    /* try {
        // Resolve relative to the project root in development
        // or to the app resources in production
        let resolvedPath: string;

        if (app.isPackaged) {
            // In production, check both inside asar and in extraResources
            const asarPath = path.join(
                process.resourcesPath,
                "app.asar",
                filePath
            );
            const extraPath = path.join(process.resourcesPath, filePath);

            resolvedPath = fs.existsSync(extraPath) ? extraPath : asarPath;
        } else {
            // In development
            resolvedPath = path.join(__dirname, "..", filePath);
        }

        console.log(`Reading JSON file from: ${resolvedPath}`);

        if (!fs.existsSync(resolvedPath)) {
            console.error(`File not found: ${resolvedPath}`);
            return [];
        }

        const fileContent = fs.readFileSync(resolvedPath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    } */
    try {
        let resolvedPath: string;

        if (app.isPackaged) {
            // In production, data files are in extraResources
            // Path structure: resources/data/personas.json
            resolvedPath = path.join(process.resourcesPath, filePath);
            console.log(`[PROD] Reading JSON file from: ${resolvedPath}`);
        } else {
            // In development: backend/data/personas.json
            resolvedPath = path.join(__dirname, "..", filePath);
            console.log(`[DEV] Reading JSON file from: ${resolvedPath}`);
        }

        if (!fs.existsSync(resolvedPath)) {
            console.error(`File not found: ${resolvedPath}`);
            console.error(`Attempted to read: ${filePath}`);
            console.error(`Process resources path: ${process.resourcesPath}`);
            console.error(`__dirname: ${__dirname}`);
            return [];
        }

        const fileContent = fs.readFileSync(resolvedPath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

export function getSqlite3(
    filename = path.join(app.getPath("userData"), "better-sqlite3.sqlite3")
) {
    console.log("Database Filename: ", filename);
    // return (dbInstance ??= new DB(filename, {
    //     // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L36
    //     // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L50
    //     nativeBinding: path.join(
    //         root,
    //         import.meta.env.VITE_BETTER_SQLITE3_BINDING
    //     ),
    // }));
    return (dbInstance ??= new DB(
        filename,
        app.isPackaged
            ? {}
            : {
                  nativeBinding: path.join(
                      root,
                      import.meta.env.VITE_BETTER_SQLITE3_BINDING
                  ),
              }
    ));
}

export async function setupDatabase(dbInstance: Database.Database) {
    console.log("Setting up database...");
    console.log("App is packaged:", app.isPackaged);
    console.log("User Database Path:", dbPath);
    // console.log("Seed Database Path:", seedDbPath);

    // SEED DATABASE SYNC - COMMENTED OUT
    // Sync user database with seed database if necessary.
    // This ensures that if the bundled seed.db is updated, the user's local db is replaced.
    // let shouldCopy = false;
    // if (fs.existsSync(seedDbPath)) {
    //     const userDbExists = fs.existsSync(dbPath);
    //     if (!userDbExists) {
    //         console.log("User database not found. Copying from seed.");
    //         shouldCopy = true;
    //     } else {
    //         const seedStat = fs.statSync(seedDbPath);
    //         const userDbStat = fs.statSync(dbPath);
    //         if (seedStat.mtime > userDbStat.mtime) {
    //             shouldCopy = true;
    //             console.log("Seed database is newer. Overwriting user database.");
    //         }
    //     }
    //
    //     if (shouldCopy) {
    //         fs.copyFileSync(seedDbPath, dbPath);
    //         console.log("✓ Seed database copied successfully!");
    //     } else if (userDbExists) {
    //         console.log("User database is up-to-date.");
    //     }
    // } else {
    //     console.log("Seed database not found. Skipping sync.");
    // }

    try {
        // Create database using better-sqlite3
        // console.log("creating database instance");
        // dbInstance = new Database(dbPath);
        // log("created database instance");

        // dbInstance.pragma("journal_mode = WAL");
        // Create tables
        dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS personas ( 
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            screensaver_path TEXT,
            theme_color TEXT
        );

        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            model_name TEXT NOT NULL,
            persona_id TEXT,
            hero_description TEXT, 
            is_featured INTEGER DEFAULT 0,
            url TEXT,
            FOREIGN KEY (persona_id) REFERENCES personas(id)
        );

        CREATE TABLE IF NOT EXISTS product_media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT,
            media_type TEXT,
            file_path TEXT NOT NULL,
            display_order INTEGER DEFAULT 0,
            is_hero_media INTEGER DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );

        CREATE TABLE IF NOT EXISTS product_specs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT,
            label TEXT,
            human_value TEXT,
            tech_value TEXT,
            icon_name TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );

        CREATE TABLE IF NOT EXISTS pdp_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT,
            section_type TEXT,
            title TEXT,
            description TEXT,
            media_path TEXT,
            layout_config TEXT,
            display_order INTEGER,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `);

        console.log(`better-sqlite3 initialized at: ${dbPath}`);
        return dbInstance;
    } catch (error) {
        console.error("Database Initialization Failed: ", error);
    }
}

export async function seedDatabase(db: Database.Database) {
    db.pragma("foreign_keys = ON");

    // --- STEP 1: CLEAR OLD DATA ---
    console.log("Clearing old data to prevent duplicates...");
    db.prepare("DELETE FROM product_specs").run();
    db.prepare("DELETE FROM product_media").run();
    db.prepare("DELETE FROM pdp_sections").run();
    db.prepare("DELETE FROM products").run();
    db.prepare("DELETE FROM personas").run();

    // --- STEP 2: INSERT PERSONAS ---
    const personas = fetchFile("data/personas.json");
    const insertPersona = db.prepare(
        `INSERT INTO personas (id, name, screensaver_path, theme_color) VALUES (?, ?, ?, ?)`
    );

    personas.forEach((p) => {
        insertPersona.run(p);
    });

    // --- STEP 3: INSERT PRODUCTS ---
    const allProducts = fetchFile("data/products.json");
    const insertProduct = db.prepare(
        `INSERT INTO products (id, model_name, persona_id, hero_description, url) VALUES (?, ?, ?, ?, ?)`
    );

    allProducts.forEach((p) => {
        insertProduct.run(p);
    });

    // --- STEP 4: INSERT DETAILED SPECS ---
    const techSpecs = fetchFile("data/specs.json");
    const insertSpec = db.prepare(
        `INSERT INTO product_specs (product_id, label, human_value, tech_value, icon_name) VALUES (?, ?, ?, ?, ?)`
    );

    techSpecs.forEach((s) => {
        insertSpec.run(s);
    });

    // --- STEP 5: INSERT ONLINE MEDIA LINKS ---
    const onlineMedia = fetchFile("data/onlineMedia.json");
    const insertMedia = db.prepare(
        `INSERT INTO product_media (product_id, media_type, file_path, display_order, is_hero_media) VALUES (?, ?, ?, ?, ?)`
    );

    onlineMedia.forEach((m) => {
        insertMedia.run(m);
    });

    console.log("Database reset and seeded successfully.");
}

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

export interface PDPSection {
    id: number;
    product_id: string;
    section_type: string;
    title: string;
    description: string;
    media_path: string;
    layout_config: string;
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
    url: string;
}

export function getProducts(personaId: string | null): Product[] {
    if (!dbInstance) {
        throw new Error("Database not initialized. Call setupDatabase first.");
    }

    let sql = `
        SELECT
            p.id,
            p.model_name,
            p.hero_description,
            p.is_featured,
            p.url,
            json_object(
                'id', per.id,
                'name', per.name,
                'theme_color', per.theme_color,
                'screensaver_path', per.screensaver_path
            ) as persona,
            (
                SELECT json_group_array(
                    json_object(
                        'id', pm.id,
                        'media_type', pm.media_type,
                        'file_path', pm.file_path,
                        'display_order', pm.display_order,
                        'is_hero_media', pm.is_hero_media
                    )
                )
                FROM product_media pm
                WHERE pm.product_id = p.id
                ORDER BY pm.display_order
            ) as media,
            (
                SELECT json_group_array(
                    json_object(
                        'id', ps.id,
                        'label', ps.label,
                        'human_value', ps.human_value,
                        'tech_value', ps.tech_value,
                        'icon_name', ps.icon_name
                    )
                )
                FROM product_specs ps
                WHERE ps.product_id = p.id
            ) as specs,
            (
                SELECT json_group_array(
                    json_object(
                        'id', pdp.id,
                        'product_id', pdp.product_id,
                        'section_type', pdp.section_type,
                        'title', pdp.title,
                        'description', pdp.description,
                        'media_path', pdp.media_path,
                        'layout_config', pdp.layout_config,
                        'display_order', pdp.display_order
                    )
                )
                FROM pdp_sections pdp
                WHERE pdp.product_id = p.id
                ORDER BY pdp.display_order
            ) as pdp_sections
        FROM
            products p
        LEFT JOIN
            personas per ON p.persona_id = per.id
    `;

    if (personaId) {
        sql += " WHERE p.persona_id = ?";
    }

    const stmt = personaId
        ? dbInstance.prepare(sql).bind(personaId)
        : dbInstance.prepare(sql);

    const rows = stmt.all();

    const products: Product[] = rows.map((row: any) => ({
        id: row.id,
        model_name: row.model_name,
        hero_description: row.hero_description,
        is_featured: row.is_featured,
        persona: row.persona ? JSON.parse(row.persona) : null,
        media: row.media ? JSON.parse(row.media) : [],
        specs: row.specs ? JSON.parse(row.specs) : [],
        pdp_sections: row.pdp_sections ? JSON.parse(row.pdp_sections) : [],
        url: row.url,
    }));

    return products;
}

export function getRecommendations(answers: Record<string, string>): Product[] {
    if (!dbInstance) {
        throw new Error("Database not initialized. Call setupDatabase first.");
    }

    const scores: Record<string, number> = {
        gaming: 0,
        creator: 0,
        office: 0,
        student: 0,
    };

    if (
        answers.persona &&
        Object.prototype.hasOwnProperty.call(scores, answers.persona)
    ) {
        scores[answers.persona] += 10;
    }

    if (answers.mobility === "desktop") {
        scores.gaming += 2;
        scores.creator += 2;
    } else if (answers.mobility === "portable") {
        scores.office += 2;
        scores.student += 2;
    }

    if (answers.workload === "multitasking") {
        scores.gaming += 2;
        scores.creator += 2;
    } else if (answers.workload === "essentials") {
        scores.student += 2;
        scores.office += 1;
    }

    if (answers.feature === "display") {
        scores.creator += 3;
    } else if (answers.feature === "battery") {
        scores.student += 2;
        scores.office += 2;
    } else if (answers.feature === "security") {
        scores.office += 3;
    }

    let bestPersona;
    let maxScore = -1;

    for (const persona in scores) {
        if (scores[persona] > maxScore) {
            maxScore = scores[persona];
            bestPersona = persona;
        }
    }

    console.log("Recommended persona: ", bestPersona);
    const allMatchingProducts = getProducts(bestPersona as string);
    return allMatchingProducts.slice(0, 3);
}

export function getProductById(productId: string): Product | null {
    if (!dbInstance) {
        throw new Error("Database not initialized.");
    }

    const sql = `
        SELECT
            p.id,
            p.model_name,
            p.hero_description,
            p.url,
            p.is_featured,
            json_object(
                'id', per.id,
                'name', per.name,
                'theme_color', per.theme_color,
                'screensaver_path', per.screensaver_path
            ) as persona,
            (
                SELECT json_group_array(
                    json_object(
                        'id', pm.id,
                        'media_type', pm.media_type,
                        'file_path', pm.file_path,
                        'display_order', pm.display_order,
                        'is_hero_media', pm.is_hero_media
                    )
                )
                FROM product_media pm
                WHERE pm.product_id = p.id
                ORDER BY pm.display_order
            ) as media,
            (
                SELECT json_group_array(
                    json_object(
                        'id', ps.id,
                        'label', ps.label,
                        'human_value', ps.human_value,
                        'tech_value', ps.tech_value,
                        'icon_name', ps.icon_name
                    )
                )
                FROM product_specs ps
                WHERE ps.product_id = p.id
            ) as specs,
            (
                SELECT json_group_array(
                    json_object(
                        'id', pdp.id,
                        'product_id', pdp.product_id,
                        'section_type', pdp.section_type,
                        'title', pdp.title,
                        'description', pdp.description,
                        'media_path', pdp.media_path,
                        'layout_config', pdp.layout_config,
                        'display_order', pdp.display_order
                    )
                )
                FROM pdp_sections pdp
                WHERE pdp.product_id = p.id
                ORDER BY pdp.display_order
            ) as pdp_sections
        FROM
            products p
        LEFT JOIN
            personas per ON p.persona_id = per.id
        WHERE p.id = ?
    `;

    const row = dbInstance.prepare(sql).get(productId) as any;

    if (!row) {
        return null;
    }

    const product: Product = {
        id: row.id,
        model_name: row.model_name,
        hero_description: row.hero_description,
        is_featured: row.is_featured,
        persona: row.persona ? JSON.parse(row.persona) : null,
        media: row.media ? JSON.parse(row.media) : [],
        specs: row.specs ? JSON.parse(row.specs) : [],
        pdp_sections: row.pdp_sections ? JSON.parse(row.pdp_sections) : [],
        url: row.url,
    };

    return product;
}

// Export dbInstance for direct access if needed
export function getDbInstance(): Database.Database | null {
    return dbInstance;
}
