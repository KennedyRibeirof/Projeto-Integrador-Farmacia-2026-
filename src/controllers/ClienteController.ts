import { Request, Response } from "express";
import { app } from "../server";
import { ClienteRepository } from "../repositories/ClienteRepository";

export function ClienteController() {
  const repository = new ClienteRepository();

  // 🔍 Listar ou buscar por nome
  app.get("/clientes", (req: Request, res: Response) => {
    const nome = req.query.nome as string | undefined;

    if (nome) {
      const cliente = repository.buscarPorNome(nome);

      if (!cliente) {
        return res.status(404).json({ erro: "Cliente não encontrado" });
      }

      return res.json(cliente);
    }

    return res.json(repository.listar());
  });

  // 🔍 Buscar por ID
  app.get("/clientes/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const cliente = repository.buscarPorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    return res.json(cliente);
  });

  // ➕ Criar cliente
  app.post("/clientes", (req: Request, res: Response) => {
    try {
      const { nome, email } = req.body;

      // ✅ validações
      if (!nome || nome.trim().length === 0) {
        throw new Error("Nome é obrigatório");
      }

      if (!email || !email.includes("@")) {
        throw new Error("Email inválido");
      }

      const cliente = repository.salvar({
        nome: nome.trim(),
        email: email.trim(),
      });

      return res.status(201).json(cliente);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      return res.status(400).json({ erro: mensagem });
    }
  });
}