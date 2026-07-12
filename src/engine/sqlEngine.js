let sqlPromise = null

/**
 * Lazily initialise the sql.js Wasm runtime exactly once.
 *
 * Both the sql.js JS glue AND the ~660 KB .wasm binary are pulled in via
 * dynamic import(), so nothing sql.js-related lives in the initial bundle or
 * the module-evaluation path. The engine is only fetched the first time a case
 * database is actually built.
 *
 * @returns {Promise<import('sql.js').SqlJsStatic>}
 */
export function getSqlJs() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const [sqlModule, wasmModule] = await Promise.all([
        import('sql.js'),
        // Vite resolves this to a hashed asset URL at build time; the ?url import
        // is now evaluated lazily rather than at module top, so it never blocks
        // (or crashes) the initial render.
        import('sql.js/dist/sql-wasm.wasm?url'),
      ])
      // sql.js is a UMD module; under Vite's dev/prod ESM interop the init
      // function can land on `.default` or be the namespace itself. Handle both.
      const initSqlJs = sqlModule.default || sqlModule
      const wasmUrl = wasmModule.default || wasmModule
      return initSqlJs({ locateFile: () => wasmUrl })
    })()
  }
  return sqlPromise
}

/**
 * Build an in-memory database from a schema + seed SQL script.
 * Each case ships its schema as a plain SQL string so no binary .db is needed.
 * @param {string} schemaSql
 * @returns {Promise<import('sql.js').Database>}
 */
export async function createDatabase(schemaSql) {
  const SQL = await getSqlJs()
  const db = new SQL.Database()
  db.run(schemaSql)
  return db
}

/**
 * Execute an arbitrary SQL string.
 * Returns the LAST result set (the one the player usually cares about) as
 * { columns, rows } plus any error message. Never throws — errors are returned
 * so the UI can render them in the results panel.
 *
 * @param {import('sql.js').Database} db
 * @param {string} sql
 * @returns {{ columns: string[], rows: Array<Record<string, unknown>>, error: string|null, empty: boolean }}
 */
export function runQuery(db, sql) {
  const trimmed = (sql || '').trim()
  if (!trimmed) {
    return { columns: [], rows: [], error: null, empty: true }
  }
  try {
    const results = db.exec(trimmed)
    if (!results || results.length === 0) {
      // Statement ran but returned no result set (e.g. an UPDATE, or empty SELECT).
      return { columns: [], rows: [], error: null, empty: true }
    }
    const last = results[results.length - 1]
    const rows = last.values.map((valueRow) => {
      const obj = {}
      last.columns.forEach((col, i) => {
        obj[col] = valueRow[i]
      })
      return obj
    })
    return { columns: last.columns, rows, error: null, empty: rows.length === 0 }
  } catch (err) {
    return { columns: [], rows: [], error: err.message || String(err), empty: false }
  }
}
