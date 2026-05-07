import { Request, Response } from "express";
import { app } from "../server";
import { ProdutoRepository } from "../repositories/ProdutoRepository";

export function ProdutoController() {
  const repository = new ProdutoRepository();

  // 🔍 Listar ou buscar por nome
  app.get("/produtos", (req: Request, res: Response) => {
    const nome = req.query.nome as string | undefined;

    if (nome) {
      const produto = repository.buscarPorNome(nome);

      if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
      }

      return res.json(produto);
    }

    return res.json(repository.listar());
  });

  // 🔍 Buscar por ID
  app.get("/produtos/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const produto = repository.buscarPorId(id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    return res.json(produto);
  });

  // ➕ Criar produto
  app.post("/produtos", (req: Request, res: Response) => {
    try {
      const { nome, preco, estoque } = req.body;

      // ✅ validações
      if (!nome || nome.trim().length === 0) {
        throw new Error("Nome é obrigatório");
      }

      if (preco === undefined || isNaN(Number(preco))) {
        throw new Error("Preço inválido");
      }

      if (Number(preco) <= 0) {
        throw new Error("Preço deve ser maior que zero");
      }

      if (estoque === undefined || isNaN(Number(estoque))) {
        throw new Error("Estoque inválido");
      }

      if (Number(estoque) < 0) {
        throw new Error("Estoque não pode ser negativo");
      }

      const produto = repository.salvar({
        nome: nome.trim(),
        preco: Number(preco),
        estoque: Number(estoque),
      });

      return res.status(201).json(produto);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      return res.status(400).json({ erro: mensagem });
    }
  });
}