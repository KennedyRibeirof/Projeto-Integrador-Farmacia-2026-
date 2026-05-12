import Database from "better-sqlite3";
import db from "../database/Database";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  salvar(cliente: Cliente): Cliente {
    const resultado = db
      .prepare("INSERT INTO clientes (nome, email) VALUES (?, ?)")
      .run(cliente.nome_completo, cliente.email, cliente.senha, cliente.data_cadastro);

    return { id: Number(resultado.lastInsertRowid), nome_completo: cliente.nome_completo, email: cliente.email, senha: cliente.senha, data_cadastro: cliente.data_cadastro };
  }

  listar(): Cliente[] {
    return db.prepare("SELECT * FROM clientes").all() as Cliente[];
  }

  buscarPorId(id: number): Cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE id = ?").get(id) as Cliente) ?? null;
  }

  buscarPorNome(nome: string): Cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE nome LIKE ?").get(`%${nome}%`) as Cliente) ?? null;
  }
}