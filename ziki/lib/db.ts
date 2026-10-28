import type { Db } from "./types";
import { buildDb } from "./seed";

// A single in-process store keeps the demo coherent across requests. On a
// serverless host each instance keeps its own copy, which is fine for a
// prototype: the seed is immutable, so every instance starts from the same
// state. Swap this module for a real database to persist writes.
const globalForDb = globalThis as unknown as { __zikiDb?: Db };

export function getDb(): Db {
  if (!globalForDb.__zikiDb) {
    globalForDb.__zikiDb = buildDb();
  }
  return globalForDb.__zikiDb;
}

export function resetDb(): Db {
  globalForDb.__zikiDb = buildDb();
  return globalForDb.__zikiDb;
}
