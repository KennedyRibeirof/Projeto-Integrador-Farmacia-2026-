import db from "../database/database";
import { Fornecedor } from "../models/Fornecedor";

export class FornecedorRepository {
  private db: Database.Database;

  constructor() {
    this.db = new Database("database.db");

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_fornecedor TEXT NOT NULL,
        cnpj TEXT NOT NULL UNIQUE
      )
    `);
  }

  criar(fornecedor: Fornecedor): Fornecedor {
    const stmt = this.db.prepare(`
      INSERT INTO fornecedores (nome_fornecedor, cnpj)
      VALUES (?, ?)
    `);

    const result = stmt.run(
      fornecedor.nome_fornecedor,
      fornecedor.cnpj
    );

    return { ...fornecedor, id: Number(result.lastInsertRowid) };
  }

  listar(): Fornecedor[] {
    const stmt = this.db.prepare(`
      SELECT * FROM fornecedores
    `);

    return stmt.all() as Fornecedor[];
  }

  buscarPorId(id: number): Fornecedor | null {
    const stmt = this.db.prepare(`
      SELECT * FROM fornecedores WHERE id = ?
    `);

    const fornecedor = stmt.get(id);
    return fornecedor || null;
  }

  buscarPorCnpj(cnpj: string): Fornecedor | null {
    const stmt = this.db.prepare(`
      SELECT * FROM fornecedores WHERE cnpj = ?
    `);

    const fornecedor = stmt.get(cnpj);
    return fornecedor || null;
  }

  atualizar(id: number, fornecedor: Fornecedor): boolean {
    const stmt = this.db.prepare(`
      UPDATE fornecedores
      SET nome_fornecedor = ?, cnpj = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      fornecedor.nome_fornecedor,
      fornecedor.cnpj,
      id
    );

    return result.changes > 0;
  }

  deletar(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM fornecedores WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }
}