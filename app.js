const express = require("express");
const mysql = require("mysql");
const app = express();

const cors = require('cors');
app.use(cors()); // Permitir solicitações de qualquer origem

const bodyParser = require('body-parser'); // Middleware para analisar o corpo da solicitação
app.use(bodyParser.json());

// Configurações do MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dev_movel",
});

// Conectar ao banco de dados MySQL
connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conexão com o MySQL estabelecida");
});

// Rota para cadastrar um novo usuário
app.post('/cadastrar_usuario', (req, res) => {
  // Obter os dados do corpo da solicitação
  const { nome, email, senha } = req.body;
  const sql = `INSERT INTO usuarios (nome, email, senha, createdAt, updatedAt) VALUES
               ('${nome}', '${email}', '${senha}', NOW(), NOW())`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }
  });
});

app.post('/cadastrar_atividade', (req, res) => {
  // Obter os dados do corpo da solicitação
  const { nome, descricao} = req.body;
  const sql = `INSERT INTO atividades (nome, descricao, createdAt, updatedAt) VALUES
               ('${nome}', '${descricao}', NOW(), NOW())`;
  // Executar a consulta SQL
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }
  });
});

// Rota para login de usuário
app.post('/login_usuario', (req, res) => {
  // Obter os dados do corpo da solicitação
  const { email, senha } = req.body;

  // Consulta SQL para verificar se o usuário com o email e senha fornecidos existe
  const sql = `SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${senha}'`;

  // Executar a consulta SQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }

    // Verificar se algum usuário foi encontrado com o email e senha fornecidos
    if (results.length > 0) {
      // Usuário encontrado, login bem-sucedido
      res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
      // Nenhum usuário encontrado com o email e senha fornecidos, login falhou
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
});

// Rota para recuperar dados da tabela de usuários
app.get("/users", (req, res) => {
  // Consulta SQL para selecionar todos os usuários da tabela
  const sql = "SELECT * FROM usuarios";

  // Executar a consulta SQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }

    // Se a consulta for bem-sucedida, retornar os resultados como JSON
    res.json(results);
  });
});

// Rota para recuperar dados da tabela de entregas
app.get("/deliveries", (req, res) => {
  // Consulta SQL para selecionar todos os usuários da tabela
  const sql = "SELECT * FROM entregas";

  // Executar a consulta SQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }

    // Se a consulta for bem-sucedida, retornar os resultados como JSON
    res.json(results);
  });
});

// Rota para recuperar dados da tabela de atividades
app.get("/activities", (req, res) => {
  // Consulta SQL para selecionar todos os usuários da tabela
  const sql = "SELECT * FROM atividades";

  // Executar a consulta SQL
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }

    // Se a consulta for bem-sucedida, retornar os resultados como JSON
    res.json(results);
  });
});


// Iniciar o servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
