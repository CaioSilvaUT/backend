const express = require("express");
const mysql = require("mysql");
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
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

app.post('/cadastrar_usuario', (req, res) => {
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
  const { nome, descricao} = req.body;
  const sql = `INSERT INTO atividades (nome, descricao, createdAt, updatedAt) VALUES
               ('${nome}', '${descricao}', NOW(), NOW())`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }
  });
});

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.usuario = decoded;
    next();
  });
}


app.post('/login_usuario', (req, res) => {
  const { email, senha } = req.body;

  const sql = `SELECT id FROM usuarios WHERE email = '${email}' AND senha = '${senha}'`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }

    if (results.length > 0) {
      const userId = results[0].id;
      // Cria o token JWT com o ID do usuário
      const token = jwt.sign({ userId: userId }, 'secreto', { expiresIn: '5m' });
      res.status(200).json({ token: token });
    } else {
      // Usuário não encontrado
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
});



app.get("/users", (req, res) => {

  const sql = "SELECT * FROM usuarios";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }
    res.json(results);
  });
});


app.get("/deliveries", (req, res) => {
  const sql = "SELECT * FROM entregas";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }

    res.json(results);
  });
});

app.get("/activities", (req, res) => {
  const sql = "SELECT * FROM atividades";


  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }
    res.json(results);
  });
});


// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
