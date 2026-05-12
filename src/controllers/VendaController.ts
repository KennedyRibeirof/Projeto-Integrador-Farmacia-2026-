import { Request, Response } from "express";
import { app } from "../server"; // ajuste o caminho conforme seu projeto
import { VendaRepository } from "../repositories/VendaRepository";
import { ProdutoRepository } from "../repositories/ProdutoRepository";

interface VendaRequest {
  clienteId: number;
  itens: { produtoId: number; quantidade: number }[];
}

export function VendaController() {
  const vendaRepository = new VendaRepository();
  const produtoRepository = new ProdutoRepository();

  app.get("/vendas", (req: Request, res: Response) => {
    res.json(vendaRepository.listar());
  });

  app.post("/vendas", (req: Request, res: Response) => {
    try {
      const { clienteId, itens } = req.body as VendaRequest;

      // ✅ validações
      if (!clienteId) {
        throw new Error("Cliente é obrigatório");
      }

      if (!itens || itens.length === 0) {
        throw new Error("A venda deve ter ao menos um item");
      }

      let total = 0;
      const itensDaVenda = [];
      const estoqueParaAtualizar: { id: number; novoEstoque: number }[] = [];

      for (const item of itens) {
        const produto = produtoRepository.buscarPorId(item.produtoId);

        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        if (!produto.id) {
          throw new Error("Produto com ID inválido");
        }

        if (item.quantidade <= 0) {
          throw new Error("Quantidade inválida");
        }

        if (item.quantidade > produto.id) {
          throw new Error(
            `Estoque insuficiente para "${produto.nome_produto}". Disponível: ${produto.id}`
          );
        }

        const subtotal = item.quantidade * produto.preco;
        total += subtotal;

        itensDaVenda.push({
          produtoId: produto.id,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          subtotal,
        });

        estoqueParaAtualizar.push({
          id: produto.id,
          novoEstoque: produto.id - item.quantidade,
        });
      }

      // ✅ salva venda
      const venda = vendaRepository.salvar({
        id_cliente: clienteId,
        data_venda: new Date(),
        valor: total,
        endereco: "Endereço de exemplo", // Substitua pelo endereço real
        status_venda: "Pendente",
      });

      // ✅ atualiza estoque
      for (const p of estoqueParaAtualizar) {
        produtoRepository.atualizarEstoque(p.id, p.novoEstoque);
      }

      return res.status(201).json(venda);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      return res.status(400).json({ erro: mensagem });
    }
  });
}