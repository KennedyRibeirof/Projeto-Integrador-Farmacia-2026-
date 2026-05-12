import db from "../database/Database";
import { Produto } from "../models/Produto";

export class ProdutoRepository {
  salvar(produto: Produto): Produto {
    const resultado = db
      .prepare("INSERT INTO produtos (nome_produto, categoria, preco, id_fornecedor) VALUES (?, ?, ?)")
      .run(produto.nome_produto, produto.preco);

    return { id: Number(resultado.lastInsertRowid), nome_produto: produto.nome_produto, categoria: produto.categoria, preco: produto.preco, id_fornecedor: produto.id_fornecedor};
  }

  listar(): Produto[] {
    return db.prepare("SELECT * FROM produtos").all() as Produto[];
  }

  buscarPorId(id: number): Produto | null {
    return (db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto) ?? null;
  }

  buscarPorNome(nome: string): Produto | null {
    return (db.prepare("SELECT * FROM produtos WHERE nome LIKE ?").get(`%${nome}%`) as Produto) ?? null;
  }

  atualizarEstoque(id: number, estoque: number): void {
    db.prepare("UPDATE produtos SET estoque = ? WHERE id = ?").run(estoque, id);
  }
}