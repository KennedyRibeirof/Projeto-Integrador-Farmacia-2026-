import Database from "better-sqlite3";
import db from "../database/Database";
import { Pagamento } from "../models/Pagamento";

export class PagamentoRepository {
  private db: Database.Database;

  constructor() {
    this.db = new Database("database.db");

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_venda INTEGER NOT NULL,
        metodo_pagamento TEXT NOT NULL
      )
    `);
  }

  criar(pagamento: Pagamento): Pagamento {
    const stmt = this.db.prepare(`
      INSERT INTO pagamentos (id_venda, metodo_pagamento)
      VALUES (?, ?)
    `);

    const result = stmt.run(
      pagamento.id_venda,
      pagamento.metodo_pagamento
    );

    return { ...pagamento, id: result.lastInsertRowid as number };
  }

  listar(): Pagamento[] {
    const stmt = this.db.prepare(`SELECT * FROM pagamentos`);
    return stmt.all() as Pagamento[];
  }

  buscarPorId(id: number): Pagamento | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM pagamentos WHERE id = ?
    `);
    return stmt.get(id) as Pagamento | undefined;
  }

  buscarPorVenda(id_venda: number): Pagamento[] {
    const stmt = this.db.prepare(`
      SELECT * FROM pagamentos WHERE id_venda = ?
    `);
    return stmt.all(id_venda) as Pagamento[];
  }

  atualizar(id: number, pagamento: Pagamento): boolean {
    const stmt = this.db.prepare(`
      UPDATE pagamentos SET
        id_venda = ?,
        metodo_pagamento = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      pagamento.id_venda,
      pagamento.metodo_pagamento,
      id
    );

    return result.changes > 0;
  }

  deletar(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM pagamentos WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }
}