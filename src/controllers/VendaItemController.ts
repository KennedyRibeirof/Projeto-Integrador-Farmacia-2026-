import { Request, Response } from "express";
import { VendaItemRepository } from "../repositories/VendaItemRepository";
import { VendaItem } from "../models/VendaItem";

const repository = new VendaItemRepository();

export class VendaItemController {

  criar(req: Request, res: Response) {
    try {
      const { id_cliente, id_venda, id_produto, quantidade, preco } = req.body;

      if (!id_cliente || !id_venda || !id_produto || !quantidade || !preco) {
        return res.status(400).json({ erro: "Dados obrigatórios não informados" });
      }

      const subtotal = quantidade * preco;

      const item: VendaItem = {
        id_cliente,
        id_venda,
        id_produto,
        quantidade,
        preco,
        subtotal
      };

      const novo = repository.criar(item);
      return res.status(201).json(novo);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar item da venda" });
    }
  }

  listar(req: Request, res: Response) {
    try {
      const lista = repository.listar();
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao listar itens" });
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

  buscarPorVenda(req: Request, res: Response) {
    try {
      const { id_venda } = req.params;

      const itens = repository.buscarPorVenda(Number(id_venda));
      return res.json(itens);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar itens da venda" });
    }
  }

  atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { id_cliente, id_venda, id_produto, quantidade, preco } = req.body;

      if (!id_cliente || !id_venda || !id_produto || !quantidade || !preco) {
        return res.status(400).json({ erro: "Dados obrigatórios não informados" });
      }

      const subtotal = quantidade * preco;

      const atualizado = repository.atualizar(Number(id), {
        id_cliente,
        id_venda,
        id_produto,
        quantidade,
        preco,
        subtotal
      });

      if (!atualizado) {
        return res.status(404).json({ erro: "Item não encontrado" });
      }

      return res.json({ mensagem: "Atualizado com sucesso" });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar item" });
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