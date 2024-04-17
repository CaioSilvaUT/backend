CREATE DATABASE dev_movel;

use dev_movel;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100),
    createdAt DATETIME,
    updatedAt DATETIME
);
INSERT INTO usuarios (nome, email, senha, createdAt, updatedAt) VALUES
('Usuário 1', 'usuario1@example.com', 'senha123', NOW(), NOW()),
('Usuário 2', 'usuario2@example.com', 'senha456', NOW(), NOW());

CREATE TABLE atividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao VARCHAR(100),
    createdAt DATETIME,
    updatedAt DATETIME
);
INSERT INTO atividades (nome, descricao, createdAt, updatedAt) VALUES
('atividade 1', 'fazer o back', NOW(), NOW()),
('atividade 2', 'fazer o front', NOW(), NOW());

CREATE TABLE entregas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    activityId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES usuarios(id),
    FOREIGN KEY (activityId) REFERENCES atividades(id)
);
INSERT INTO entregas (userId, activityId, createdAt, updatedAt) VALUES
(1, 1, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(2, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());
