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

-- INSERTs

INSERT INTO clientes (id, nome_completo, email, senha, data_cadastro)
VALUES
(1, 'Joelson Silva', 'joelsi@gmail.com', '7458656', '2018-02-05'),
(2, 'Hélio Oliver', 'helioo@gmail.com', '2541698', '2025-06-18'),
(3, 'Ilza Teixeira', 'ilzatei@gmail.com', '1547848', '2025-06-03');
 
SELECT * FROM clientes;
 
-- Inserção de fornecedores
INSERT INTO fornecedores (id, nome_fornecedor, cnpj)
VALUES
(1, 'PLFornece', '16485297000841'),
(2, 'Fornecedor01', '48571867000584');

SELECT * FROM fornecedores;
 
-- Inserção de produtos
INSERT INTO produtos (id, nome_produto, categoria, preco, id_fornecedor)
VALUES
(1, 'Hidratante Corporal', 'cosméticos', 89.90, 1);

SELECT * FROM produtos;
 
-- Inserção de pedidos
INSERT INTO vendas (id, id_cliente, endereco, data_venda, valor, status_venda)
VALUES
(1, 1, 'Av. Alagoas Sul', '2018-05-11', 569.70, 'pendente'),
(2, 2, 'Rua Pedro Alonso', '2025-06-19', 250.00, 'pendente'),
(3, 3, 'Rua Affonso Pina', '2025-06-03', 180.00, 'enviado');
 
SELECT * FROM vendas;
   
-- Inserção no estoque
INSERT INTO estoque (id, id_produto, quantidade)
VALUES
(1, 1, 5),
(2, 1, 6),
(3, 1, 8);
 
SELECT * FROM estoque;
 
-- Inserção de pagamentos
INSERT INTO pagamentos (id, id_venda, metodo_pagamento, status_pagamento)
VALUES
(1, 1, 'cartao', 'pendente'),
(2, 2, 'pix', 'pendente'),
(3, 3, 'cartao', 'pago');
 
SELECT * FROM pagamentos; 

-- Inserção de itens do pedido
INSERT INTO venda_item (id, id_cliente, id_venda, id_produto, quantidade, preco, subtotal)
VALUES
(1, 5, 1, 3, 5, 189.90, 569.70),
(2, 2, 1, 2, 1, 250.00, 250.00),
(3, 9, 2, 1, 2, 45.00, 90.00),
(4, 4, 3, 1, 4, 45.00, 180.00);
 
SELECT * FROM Venda_Item;

-- =========================
-- CONSULTAS
-- =========================

SELECT * FROM pagamentos WHERE status_pagamento = 'pendente';

SELECT 
    v.id AS venda,
    v.valor,
    pg.status_pagamento
FROM vendas v
JOIN pagamentos pg ON v.id = pg.id_venda
WHERE v.valor > 500.00;

SELECT * FROM venda_item WHERE id_produto = 1;

SELECT * FROM vendas WHERE id = 1;

SELECT * FROM vendas
WHERE data_venda BETWEEN '2025-06-01' AND '2025-06-03';

-- =========================
-- UPDATES
-- =========================

UPDATE vendas SET status_venda = 'entregue' WHERE id = 1;

UPDATE vendas SET valor = 950.00 WHERE id = 2;

UPDATE pagamentos SET status_pagamento = 'cancelado' WHERE status_pagamento = 'pendente';

UPDATE venda_item SET quantidade = 3 WHERE id = 1;

UPDATE vendas SET valor = valor * 0.85 WHERE id IN (1, 2);

UPDATE venda_item
SET quantidade = 3
WHERE id_venda = 1 AND id_produto = 3;

-- CONSULTAS AVANÇADAS

SELECT 
    vi.quantidade,
    p.preco,
    (vi.quantidade * p.preco) AS total
FROM venda_item vi
JOIN produtos p ON vi.id_produto = p.id
WHERE vi.id_venda = 1;

SELECT nome_produto, categoria FROM produtos;

SELECT 
    c.nome_completo,
    v.id AS venda,
    v.valor
FROM clientes c
JOIN vendas v ON c.id = v.id_cliente;

SELECT 
    p.nome_produto,
    v.quantidade
FROM produtos p
JOIN venda_item v ON p.id = v.id_produto
WHERE p.categoria = 'cosméticos';

SELECT 
    p.nome_produto AS produto,
    f.nome_fornecedor AS fornecedor
FROM produtos p
JOIN fornecedores f ON p.id_fornecedor = f.id;

SELECT
    c.nome_completo,
    v.id AS venda,
    pg.status_pagamento
FROM clientes c
JOIN vendas p ON c.id = v.id_cliente
JOIN pagamentos pg ON v.id = pg.id_venda;

SELECT * FROM Clientes
ORDER BY nome_completo ASC;

SELECT * FROM Produtos
ORDER BY preco DESC;

SELECT * FROM vendas
ORDER BY nome_produto ASC
LIMIT 5;

SELECT * FROM vendas
ORDER BY data_venda DESC;

SELECT * FROM Estoque
ORDER BY id_produto ASC, quantidade ASC;

SELECT * FROM Clientes
ORDER BY nome_completo ASC
LIMIT 5
OFFSET 5;

SELECT * FROM Clientes 
ORDER BY nome_completo ASC
LIMIT 3
OFFSET 2;

SELECT * FROM vendas
ORDER BY data_venda dESC 
LIMIT 10;

SELECT * FROM fornecedores
ORDER BY nome_fornecedor ASC
LIMIT 4;
