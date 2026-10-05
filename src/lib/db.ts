import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  normalizeBrief,
  type Brief,
  type PaperRecord,
  type PaperSummary,
} from "@/lib/brief";

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  const dataDir = path.join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });
  const database = new Database(path.join(dataDir, "paperbrief.db"));
  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS papers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      authors TEXT NOT NULL DEFAULT '[]',
      year TEXT NOT NULL DEFAULT '',
      model TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      brief TEXT NOT NULL,
      source_text TEXT NOT NULL DEFAULT ''
    );
  `);
  db = database;
  return database;
}

type Row = {
  id: string;
  title: string;
  authors: string;
  year: string;
  model: string;
  created_at: number;
  brief: string;
  source_text: string;
};

function rowToBrief(row: Row): Brief {
  try {
    return normalizeBrief(JSON.parse(row.brief));
  } catch {
    return normalizeBrief({});
  }
}

function parseAuthors(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function createPaper(input: {
  brief: Brief;
  model: string;
  sourceText: string;
}): PaperRecord {
  const database = getDb();
  const id = randomUUID();
  const createdAt = Date.now();
  database
    .prepare(
      `INSERT INTO papers (id, title, authors, year, model, created_at, brief, source_text)
       VALUES (@id, @title, @authors, @year, @model, @created_at, @brief, @source_text)`,
    )
    .run({
      id,
      title: input.brief.title,
      authors: JSON.stringify(input.brief.authors),
      year: input.brief.year,
      model: input.model,
      created_at: createdAt,
      brief: JSON.stringify(input.brief),
      source_text: input.sourceText,
    });
  return {
    id,
    title: input.brief.title,
    authors: input.brief.authors,
    year: input.brief.year,
    model: input.model,
    createdAt,
    brief: input.brief,
    sourceText: input.sourceText,
  };
}

export function listPapers(): PaperSummary[] {
  const database = getDb();
  const rows = database
    .prepare(`SELECT * FROM papers ORDER BY created_at DESC`)
    .all() as Row[];
  return rows.map((row) => {
    const brief = rowToBrief(row);
    return {
      id: row.id,
      title: row.title,
      authors: parseAuthors(row.authors),
      year: row.year,
      model: row.model,
      createdAt: row.created_at,
      tldr: brief.tldr,
      methodTags: brief.methodTags,
    };
  });
}

export function getPaper(id: string): PaperRecord | null {
  const database = getDb();
  const row = database
    .prepare(`SELECT * FROM papers WHERE id = ?`)
    .get(id) as Row | undefined;
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    authors: parseAuthors(row.authors),
    year: row.year,
    model: row.model,
    createdAt: row.created_at,
    brief: rowToBrief(row),
    sourceText: row.source_text,
  };
}

export function deletePaper(id: string): boolean {
  const database = getDb();
  const result = database.prepare(`DELETE FROM papers WHERE id = ?`).run(id);
  return result.changes > 0;
}
