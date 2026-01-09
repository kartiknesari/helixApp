import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import type initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

const dbPath = app.isPackaged 
  ? path.join(app.getPath('userData'), 'v5_retail.db') 
  : 'v5_retail.db';

let dbInstance: Database;

function persistToDisk(db: Database) {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export async function setupDatabase() {
  console.log('Setting up database...');
  console.log('App is packaged:', app.isPackaged);
  console.log('Process resourcesPath:', process.resourcesPath);
  console.log('__dirname:', __dirname);

  // Dynamic import for sql.js
  const initSqlJsModule = await import('sql.js');
  const initSqlJsFn: typeof initSqlJs = initSqlJsModule.default;

  const SQL = await initSqlJsFn({
    locateFile: (file: string) => {
      let wasmPath: string;
      
      if (app.isPackaged) {
        // In production: WASM is in process.resourcesPath
        wasmPath = path.join(process.resourcesPath, file);
      } else {
        // In development: __dirname is .vite/build, WASM is in .vite/build/sql-wasm.wasm
        wasmPath = path.join(__dirname, file);
      }
      
      console.log('Looking for WASM file at:', wasmPath);
      console.log('WASM file exists:', fs.existsSync(wasmPath));
      
      if (!fs.existsSync(wasmPath)) {
        throw new Error(`WASM file not found at: ${wasmPath}`);
      }
      
      return wasmPath;
    }
  });

  if (fs.existsSync(dbPath)) {
    console.log('Loading existing database from:', dbPath);
    const fileBuffer = fs.readFileSync(dbPath);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    console.log('Creating new database');
    dbInstance = new SQL.Database();
  }

  dbInstance.run(`
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
  `);

  persistToDisk(dbInstance);
  console.log(`sql.js initialized successfully at: ${dbPath}`);
  return dbInstance;
}

export function seedDatabase(db: Database) {
  db.run('PRAGMA foreign_keys = ON');

  const personas = [
    ['gaming', 'Gaming', 'media/screensavers/gaming_helix.mp4', '#FF4500'],
    ['creator', 'Creator', 'media/screensavers/creator_helix.mp4', '#9333EA'],
    ['office', 'Office', 'media/screensavers/office_helix.mp4', '#2563EB'],
    ['student', 'Student', 'media/screensavers/student_helix.mp4', '#10B981']
  ];

  personas.forEach(p => {
    db.run(`INSERT OR IGNORE INTO personas (id, name, screensaver_path, theme_color) VALUES (?, ?, ?, ?)`, p);
  });

  const allProducts = [
    ['omen-17', 'OMEN 17', 'gaming', 'Desktop-class power in a portable form factor.'],
    ['omen-16', 'OMEN 16', 'gaming', 'The perfectly balanced engine for competitive play.'],
    ['victus-16', 'Victus 16', 'gaming', 'Serious gaming performance at an accessible value.'],
    ['spectre-16', 'Spectre x360 16', 'creator', 'A 16-inch canvas for your biggest creative ideas.'],
    ['envy-16', 'Envy 16', 'creator', 'Power and precision for editing 4K video on the go.'],
    ['pavilion-plus-14-oled', 'Pavilion Plus 14 OLED', 'creator', 'Compact creator power with a stunning OLED display.'],
    ['elitebook-840', 'EliteBook 840 G10', 'office', 'The corporate standard for security and performance.'],
    ['probook-450', 'ProBook 450 G10', 'office', 'Essential business power for the modern professional.'],
    ['elite-x360', 'Elite x360 830', 'office', 'Premium flexibility for executive leaders.'],
    ['pavilion-14-std', 'Pavilion Plus 14', 'student', 'The all-day companion for lectures and late-night study.'],
    ['pavilion-x360', 'Pavilion x360 14', 'student', 'The versatile laptop for taking notes and streaming movies.'],
    ['hp-laptop-15', 'HP Laptop 15', 'student', 'Affordable, reliable, and ready for every assignment.']
  ];

  allProducts.forEach(p => {
    db.run(`INSERT OR IGNORE INTO products (id, model_name, persona_id, hero_description) VALUES (?, ?, ?, ?)`, p);
  });

  const allSpecs = [
    ['omen-17', 'Performance', 'Crush AAA titles with pro-level frame rates.', 'GiRocket'],
    ['omen-17', 'Cooling', 'Omen Tempest Cooling stays quiet during long raids.', 'FiWind'],
    ['spectre-16', 'Display', 'Vibrant OLED touch screen with pro-grade color accuracy.', 'FiEdit'],
    ['spectre-16', 'Flexibility', 'Flips 360 degrees to go from laptop to creative tablet.', 'FiRefreshCw'],
    ['elitebook-840', 'Collaboration', 'AI-enhanced video and audio for crystal-clear calls.', 'FiUsers'],
    ['elitebook-840', 'Security', 'Hardware-level protection to keep your data safe.', 'FiLock'],
    ['pavilion-14-std', 'Battery', 'Lasts through your longest school day on one charge.', 'FiBattery'],
    ['pavilion-14-std', 'Sustainability', 'Built with recycled materials for a greener future.', 'FiGlobe']
  ];

  allSpecs.forEach(s => {
    db.run(`INSERT OR IGNORE INTO product_specs (product_id, label, human_value, icon_name) VALUES (?, ?, ?, ?)`, s);
  });

  persistToDisk(db);
  console.log("Database seeded successfully via sql.js");
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

export interface Product {
  id: string;
  model_name: string;
  hero_description: string;
  is_featured: number;
  persona: Persona | null;
  media: ProductMedia[];
  specs: ProductSpec[];
}

export function getProducts(personaId?: string): Product[] {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call setupDatabase first.");
  }

  let sql = `
    SELECT
      p.id,
      p.model_name,
      p.hero_description,
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
      ) as specs
    FROM
      products p
    LEFT JOIN
      personas per ON p.persona_id = per.id
  `;

  if (personaId) {
    sql += ' WHERE p.persona_id = ?';
  }

  const stmt = dbInstance.prepare(sql);
  if (personaId) {
    stmt.bind([personaId]);
  }

  const products: Product[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    products.push({
      id: row.id as string,
      model_name: row.model_name as string,
      hero_description: row.hero_description as string,
      is_featured: row.is_featured as number,
      persona: row.persona ? JSON.parse(row.persona as string) : null,
      media: row.media ? JSON.parse(row.media as string) : [],
      specs: row.specs ? JSON.parse(row.specs as string) : [],
    });
  }

  stmt.free();
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

  if (answers.persona && Object.prototype.hasOwnProperty.call(scores, answers.persona)) {
    scores[answers.persona] += 10;
  }

  if (answers.mobility === 'desktop') {
    scores.gaming += 2;
    scores.creator += 2;
  } else if (answers.mobility === 'portable') {
    scores.office += 2;
    scores.student += 2;
  }

  if (answers.workload === 'multitasking') {
    scores.gaming += 2;
    scores.creator += 2;
  } else if (answers.workload === 'essentials') {
    scores.student += 2;
    scores.office += 1;
  }

  if (answers.feature === 'display') {
    scores.creator += 3;
  } else if (answers.feature === 'battery') {
    scores.student += 2;
    scores.office += 2;
  } else if (answers.feature === 'security') {
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

  console.log("Recommended persona:", bestPersona);
  const allMatchingProducts = getProducts(bestPersona);
  console.log("Recommended products:", allMatchingProducts);
  return allMatchingProducts.slice(0, 3);
}