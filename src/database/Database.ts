import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../banco.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE Clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo VARCHAR(100) NOT NULL CHECK (length(nome_completo) >= 3),
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email LIKE '%@%._%'),
    senha VARCHAR(100) CHECK (length(senha) >= 6),
    data_cadastro DATE
);

CREATE INDEX idx_email ON clientes(email);

CREATE TABLE fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_fornecedor VARCHAR(100) NOT NULL CHECK (length(nome_fornecedor) >= 3),
    cnpj VARCHAR(100) UNIQUE NOT NULL 
    CHECK (length(cnpj) = 14 AND cnpj NOT GLOB '*[^0-9]*')
);

CREATE INDEX idx_cnpj ON fornecedores(cnpj);

CREATE TABLE Produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_produto VARCHAR(100) NOT NULL CHECK (length(nome_produto) >= 2),
    categoria VARCHAR(100) NOT NULL CHECK (categoria IN ('cosméticos')),
    preco DECIMAL(10,2) CHECK (preco >= 0),
    id_fornecedor INTEGER NOT NULL CHECK (id_fornecedor > 0),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id)
);

CREATE TABLE vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL CHECK (id_cliente > 0),
    endereco VARCHAR(100) CHECK (endereco IS NULL OR length(endereco) >= 5),
    data_venda DATE NOT NULL,
    valor DECIMAL(10,2) CHECK (valor >= 0),
    status_venda VARCHAR(100) 
    CHECK (status_venda IN ('pendente', 'processando', 'enviado', 'entregue', 'cancelado')),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE Estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL CHECK (id_produto > 0),
    quantidade INT NOT NULL CHECK (quantidade >= 0),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

CREATE TABLE pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venda INTEGER UNIQUE NOT NULL CHECK (id_venda > 0),
    metodo_pagamento VARCHAR(100) 
    CHECK (metodo_pagamento IN ('pix', 'cartao', 'boleto', 'dinheiro')),
    status_pagamento VARCHAR(100) NOT NULL 
    CHECK (status_pagamento IN ('pendente', 'pago', 'recusado', 'cancelado')),
    FOREIGN KEY (id_venda) REFERENCES vendas(id)
);

CREATE TABLE Venda_Item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL CHECK (id_cliente > 0),
    id_venda INTEGER NOT NULL CHECK (id_venda > 0),
    id_produto INTEGER NOT NULL CHECK (id_produto > 0),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco DECIMAL(10,2) CHECK (preco >= 0),
    subtotal DECIMAL(10,2) CHECK (subtotal >= 0),
    FOREIGN KEY (id_venda) REFERENCES vendas(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);
`);

export default db;