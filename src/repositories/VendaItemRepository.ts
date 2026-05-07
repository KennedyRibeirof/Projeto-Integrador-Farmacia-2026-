import Database from "../database/database";
import { VendaItem } from "../models/VendaItem";

export class VendaItemRepository {
  private db: Database.Database;

  constructor() {
    this.db = new Database("database.db");

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS venda_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_cliente INTEGER NOT NULL,
        id_venda INTEGER NOT NULL,
        id_produto INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        preco REAL NOT NULL,
        subtotal REAL NOT NULL
      )
    `);
  }

  criar(item: VendaItem): VendaItem {
    const stmt = this.db.prepare(`
      INSERT INTO venda_itens 
      (id_cliente, id_venda, id_produto, quantidade, preco, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      item.id_cliente,
      item.id_venda,
      item.id_produto,
      item.quantidade,
      item.preco,
      item.subtotal
    );

    return { ...item, id: result.lastInsertRowid as number };
  }

  listar(): VendaItem[] {
    const stmt = this.db.prepare(`SELECT * FROM venda_itens`);
    return stmt.all() as VendaItem[];
  }

  buscarPorId(id: number): VendaItem | undefined {
    const stmt = this.db.prepare(`SELECT * FROM venda_itens WHERE id = ?`);
    return stmt.get(id) as VendaItem | undefined;
  }

  buscarPorVenda(id_venda: number): VendaItem[] {
    const stmt = this.db.prepare(`
      SELECT * FROM venda_itens WHERE id_venda = ?
    `);
    return stmt.all(id_venda) as VendaItem[];
  }

  atualizar(id: number, item: VendaItem): boolean {
    const stmt = this.db.prepare(`
      UPDATE venda_itens SET
        id_cliente = ?,
        id_venda = ?,
        id_produto = ?,
        quantidade = ?,
        preco = ?,
        subtotal = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      item.id_cliente,
      item.id_venda,
      item.id_produto,
      item.quantidade,
      item.preco,
      item.subtotal,
      id
    );

    return result.changes > 0;
  }

  deletar(id: number): boolean {
    const stmt = this.db.prepare(`DELETE FROM venda_itens WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }
}