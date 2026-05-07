import { Request, Response } from "express";
import { FornecedorRepository } from "../repositories/FornecedorRepository";
import { Fornecedor } from "../models/Fornecedor";

const repository = new FornecedorRepository();

export class FornecedorController {

  criar(req: Request, res: Response) {
    try {
      const { nome_fornecedor, cnpj } = req.body;

      if (!nome_fornecedor || !cnpj) {
        return res.status(400).json({ erro: "Nome e CNPJ são obrigatórios" });
      }

      const fornecedor: Fornecedor = {
        nome_fornecedor,
        cnpj
      };

      const novo = repository.criar(fornecedor);
      return res.status(201).json(novo);

    } catch (error: any) {
      // Tratando erro de CNPJ duplicado (UNIQUE)
      if (error.message?.includes("UNIQUE")) {
        return res.status(400).json({ erro: "CNPJ já cadastrado" });
      }

      return res.status(500).json({ erro: "Erro ao criar fornecedor" });
    }
  }

  listar(req: Request, res: Response) {
    try {
      const lista = repository.listar();
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao listar fornecedores" });
    }
  }

  buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const fornecedor = repository.buscarPorId(Number(id));

      if (!fornecedor) {
        return res.status(404).json({ erro: "Fornecedor não encontrado" });
      }

      return res.json(fornecedor);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar fornecedor" });
    }
  }

  atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome_fornecedor, cnpj } = req.body;

      if (!nome_fornecedor || !cnpj) {
        return res.status(400).json({ erro: "Nome e CNPJ são obrigatórios" });
      }

      const atualizado = repository.atualizar(Number(id), {
        nome_fornecedor,
        cnpj
      });

      if (!atualizado) {
        return res.status(404).json({ erro: "Fornecedor não encontrado" });
      }

      return res.json({ mensagem: "Atualizado com sucesso" });

    } catch (error: any) {
      if (error.message?.includes("UNIQUE")) {
        return res.status(400).json({ erro: "CNPJ já cadastrado" });
      }

      return res.status(500).json({ erro: "Erro ao atualizar fornecedor" });
    }
  }

  deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletado = repository.deletar(Number(id));

      if (!deletado) {
        return res.status(404).json({ erro: "Fornecedor não encontrado" });
      }

      return res.json({ mensagem: "Deletado com sucesso" });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao deletar fornecedor" });
    }
  }
}