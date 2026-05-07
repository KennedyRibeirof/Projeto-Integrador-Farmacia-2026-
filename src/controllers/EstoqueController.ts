import { Request, Response } from "express";
import { EstoqueRepository } from "../repositories/EstoqueRepository";
import { Estoque } from "../models/Estoque";

const repository = new EstoqueRepository();

export class EstoqueController {

  criar(req: Request, res: Response) {
    try {
      const { id_produto, quantidade } = req.body;

      if (!id_produto || quantidade == null) {
        return res.status(400).json({ erro: "Dados inválidos" });
      }

      const estoque: Estoque = {
        id_produto,
        quantidade
      };

      const novo = repository.criar(estoque);
      return res.status(201).json(novo);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar estoque" });
    }
  }

  listar(req: Request, res: Response) {
    try {
      const lista = repository.listar();
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao listar estoque" });
    }
  }

  buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const item = repository.buscarPorId(Number(id));

      if (!item) {
        return res.status(404).json({ erro: "Item não encontrado" });
      }

      return res.json(item);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar item" });
    }
  }

  atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { id_produto, quantidade } = req.body;

      const atualizado = repository.atualizar(Number(id), {
        id_produto,
        quantidade
      });

      if (!atualizado) {
        return res.status(404).json({ erro: "Item não encontrado" });
      }

      return res.json({ mensagem: "Atualizado com sucesso" });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar estoque" });
    }
  }

  deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletado = repository.deletar(Number(id));

      if (!deletado) {
        return res.status(404).json({ erro: "Item não encontrado" });
      }

      return res.json({ mensagem: "Deletado com sucesso" });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao deletar item" });
    }
  }
}