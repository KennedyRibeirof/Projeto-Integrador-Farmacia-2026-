import Database from "better-sqlite3";
import db from "../database/Database";
import { Estoque } from "../models/Estoque";

export class EstoqueRepository {
  private db: Database.Database;

  constructor() {
    this.db = new Database("database.db");

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS estoque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_produto TEXT NOT NULL,
        quantidade INTEGER NOT NULL
      )
    `);
  }

  criar(estoque: Estoque): Estoque {
    const stmt = this.db.prepare(`
      INSERT INTO estoque (id_produto, quantidade)
      VALUES (?, ?)
    `);

    const result = stmt.run(
      estoque.id_produto,
      estoque.quantidade
    );

    return { ...estoque, id: Number(result.lastInsertRowid) };
  }

  listar(): Estoque[] {
    const stmt = this.db.prepare(`
      SELECT * FROM estoque
    `);

    return stmt.all() as Estoque[];
  }

  buscarPorId(id: number): Estoque | null {
    const stmt = this.db.prepare(`
      SELECT * FROM estoque WHERE id = ?
    `);

    const estoque = stmt.get(id);
    return estoque // @ts-ignore
      ? (estoque as Estoque)
      : null;
  }

  buscarPorProduto(id_produto: string): Estoque | null {
    const stmt = this.db.prepare(`
      SELECT * FROM estoque WHERE id_produto = ?
    `);

    const estoque = stmt.get(id_produto);
    return estoque // @ts-ignore
      ? (estoque as Estoque)
      : null;
  }

  atualizar(id: number, estoque: Estoque): boolean {
    const stmt = this.db.prepare(`
      UPDATE estoque
      SET id_produto = ?, quantidade = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      estoque.id_produto,
      estoque.quantidade,
      id
    );

    return result.changes > 0;
  }

  atualizarQuantidade(id_produto: string, quantidade: number): boolean {
    const stmt = this.db.prepare(`
      UPDATE estoque
      SET quantidade = ?
      WHERE id_produto = ?
    `);

    const result = stmt.run(quantidade, id_produto);
    return result.changes > 0;
  }

  deletar(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM estoque WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }
}