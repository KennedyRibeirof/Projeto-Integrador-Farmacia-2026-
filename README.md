# 🧴 SoftSkin - E-commerce de Hidratante Corporal

**Status do Projeto:** Em desenvolvimento / Concluído  

---

## 🚀 Sobre o Projeto
O **SoftSkin** é uma plataforma completa de venda de cosméticos, focada na experiência de compra de hidratantes corporais.  

O projeto foi construído para demonstrar o domínio de uma stack moderna e uma arquitetura de software profissional, garantindo que a aplicação seja robusta, tipada e de fácil manutenção.

---

## 🛠️ Tecnologias e Ferramentas (Stack)

O projeto utiliza o que há de mais moderno no ecossistema JavaScript para garantir segurança e performance:

| Tecnologia       | Função |
|-----------------|--------|
| Node.js         | Ambiente de execução para o BackEnd |
| TypeScript      | Tipagem estática para evitar erros em tempo de execução e melhorar o autocomplete |
| Express         | Framework ágil para criação das rotas da API REST |
| Better-SQLite3  | Banco de dados SQL local de alta performance e baixa latência |
| Nodemon / ts-node | Agilidade no fluxo de desenvolvimento e execução direta de TS |

---

## 🏗️ Arquitetura do Sistema

Para este projeto, foi aplicado o padrão de **Separação de Responsabilidades**, dividindo o BackEnd em camadas lógicas:

- **Model (Entidades):**  
  Definição das classes e objetos de negócio (ex: Produto, Usuário, Pedido)

- **Repository (Acesso a Dados & SQL):**  
  Responsável pela comunicação direta com o banco de dados.  
  Contém criação de tabelas e queries `SELECT`, `INSERT` e `UPDATE`

- **Controller (API REST & Validações):**  
  Camada intermediária que recebe requisições, valida regras de negócio e retorna respostas HTTP

- **Database:**  
  Configuração centralizada da integração com o SQLite, garantindo estabilidade e performance

---

## 🚀 Funcionalidades Principais

- 🛍️ **Gestão de Produtos:**  
  Listagem dinâmica dos hidratantes diretamente do banco de dados

- 🔄 **Fluxo de Venda:**  
  Integração entre FrontEnd e API para processamento de pedidos

- 📱 **Interface Responsiva:**  
  Design focado na conversão de vendas e usabilidade

- 💾 **Persistência SQL:**  
  Armazenamento seguro de produtos e vendas

---

## 🧠 Desafio Técnico

Um dos principais desafios foi a integração do **TypeScript** com o **Better-SQLite3**.

O objetivo foi garantir que os dados retornados do banco respeitassem as interfaces definidas na camada de Model, assegurando que o FrontEnd receba exatamente o que espera.

Isso resultou em:
- ✅ Redução significativa de bugs
- ✅ Maior confiabilidade na integração
- ✅ Código mais seguro e previsível

---

## 📌 Objetivo

Demonstrar domínio de:
- Arquitetura em camadas
- Boas práticas de desenvolvimento
- Tipagem forte com TypeScript
- Integração eficiente com banco de dados SQL