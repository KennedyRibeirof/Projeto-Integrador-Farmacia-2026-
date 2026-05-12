import db from "../database/Database";
import { Venda } from "../models/Venda";

export class VendaRepository {
  salvar(venda: Venda): Venda {
    const resultado = db
      .prepare(
        `
        INSERT INTO vendas
        (id_cliente, endereco, data_venda, valor, status_venda)
        VALUES (?, ?, ?, ?, ?)
        `
      )
      .run(
        venda.id_cliente,
        venda.endereco,
        venda.data_venda.toISOString(),
        venda.valor,
        venda.status_venda
      );

    return {
      id: Number(resultado.lastInsertRowid),
      id_cliente: venda.id_cliente,
      endereco: venda.endereco,
      data_venda: venda.data_venda,
      valor: venda.valor,
      status_venda: venda.status_venda,
    };
  }

  listar(): Venda[] {
    return db.prepare("SELECT * FROM vendas").all() as Venda[];
  }

  buscarPorId(id: number): Venda | null {
    return (
      db.prepare("SELECT * FROM vendas WHERE id = ?").get(id) as Venda
    ) ?? null;
  }

  buscarPorCliente(id_cliente: number): Venda[] {
    return db
      .prepare("SELECT * FROM vendas WHERE id_cliente = ?")
      .all(id_cliente) as Venda[];
  }

  buscarPorEndereco(endereco: string): Venda[] {
    return db
      .prepare("SELECT * FROM vendas WHERE endereco LIKE ?")
      .all(`%${endereco}%`) as Venda[];
  }

  buscarPorStatus(status_venda: string): Venda[] {
    return db
      .prepare("SELECT * FROM vendas WHERE status_venda = ?")
      .all(status_venda) as Venda[];
  }

  buscarPorData(data_venda: string): Venda[] {
    return db
      .prepare("SELECT * FROM vendas WHERE date(data_venda) = date(?)")
      .all(data_venda) as Venda[];
  }

  atualizar(id: number, venda: Venda): boolean {
    const resultado = db
      .prepare(
        `
        UPDATE vendas SET
          id_cliente = ?,
          endereco = ?,
          data_venda = ?,
          valor = ?,
          status_venda = ?
        WHERE id = ?
        `
      )
      .run(
        venda.id_cliente,
        venda.endereco,
        venda.data_venda.toISOString(),
        venda.valor,
        venda.status_venda,
        id
      );

    return resultado.changes > 0;
  }

  deletar(id: number): boolean {
    const resultado = db
      .prepare("DELETE FROM vendas WHERE id = ?")
      .run(id);

    return resultado.changes > 0;
  }
}