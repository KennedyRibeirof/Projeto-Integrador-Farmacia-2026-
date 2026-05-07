import { Request, Response } from "express";
import { PagamentoRepository } from "../repositories/PagamentoRepository";
import { Pagamento } from "../models/Pagamento";

const repository = new PagamentoRepository();

export class PagamentoController {

  criar(req: Request, res: Response) {
    try {
      const { id_venda, metodo_pagamento } = req.body;

      if (!id_venda || !metodo_pagamento) {
        return res.status(400).json({ erro: "id_venda e metodo_pagamento são obrigatórios" });
      }

      const pagamento: Pagamento = {
        id_venda,
        metodo_pagamento
      };

      const novo = repository.criar(pagamento);
      return res.status(201).json(novo);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar pagamento" });
    }
  }

  listar(req: Request, res: Response) {
    try {
      const lista = repository.listar();
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao listar pagamentos" });
    }
  }

  buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const pagamento = repository.buscarPorId(Number(id));

      if (!pagamento) {
        return res.status(404).json({ erro: "Pagamento não encontrado" });
      }

      return res.json(pagamento);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar pagamento" });
    }
  }

  buscarPorVenda(req: Request, res: Response) {
    try {
      const { id_venda } = req.params;

      const pagamentos = repository.buscarPorVenda(Number(id_venda));
      return res.json(pagamentos);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar pagamentos da venda" });
    }
  }

  atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { id_venda, metodo_pagamento } = req.body;

      if (!id_venda || !metodo_pagamento) {
        return res.status(400).json({ erro: "id_venda e metodo_pagamento são obrigatórios" });
      }

      const atualizado = repository.atualizar(Number(id), {
        id_venda,
        metodo_pagamento
      });

      if (!atualizado) {
        return res.status(404).json({ erro: "Pagamento não encontrado" });
      }

      return res.json({ mensagem: "Atualizado com sucesso" });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar pagamento" });
    }
  }

  deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletado = repository.deletar(Number(id));

      if (!deletado) {
        return res.status(404).json({ erro: "Pagamento não encontrado" });
      }

      return res.json({ mensagem: "Deletado com sucesso" });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao deletar pagamento" });
    }
  }
}