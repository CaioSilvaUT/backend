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


CREATE TABLE atividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao VARCHAR(100),
    createdAt DATETIME,
    updatedAt DATETIME
);

CREATE TABLE entregas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    activityId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES usuarios(id),
    FOREIGN KEY (activityId) REFERENCES atividades(id)
);
