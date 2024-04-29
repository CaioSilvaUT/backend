const express = require("express");
const mysql = require("mysql");
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dev_movel",
});
connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conexão com o MySQL estabelecida");
});

app.post('/cadastrar_usuario', (req, res) => {
  const { nome, email, senha } = req.body;
  
  const emailCheckQuery = `SELECT COUNT(*) AS count FROM usuarios WHERE email = '${email}'`;
  connection.query(emailCheckQuery, (err, results) => {
    if (err) {
      console.error("Erro ao verificar email duplicado:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    const emailCount = results[0].count;
    if (emailCount > 0) {
      return res.status(400).json({ error: "Já existe um usuário com este email" });
    }
    const sql = `INSERT INTO usuarios (nome, email, senha, createdAt, updatedAt) VALUES
                 ('${nome}', '${email}', '${senha}', NOW(), NOW())`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar usuário:", err);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
    });
  });
});

app.post('/cadastrar_entrega', (req, res) => {
  const { userId: reqUserId, atividadeId, notaEntrega } = req.body;
  const decodedToken = req.usuario;
  const tokenUserId = decodedToken.userId;

  if (reqUserId !== tokenUserId) {
    return res.status(403).json({ error: 'A entrega só pode ser feita pelo usuário logado' });
  }
  const sql = `INSERT INTO atividades (nome, descricao, createdAt, updatedAt) VALUES
               ('${nome}', '${descricao}'', ${dataEntrega}', NOW(), NOW())`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
      return;
    }
  });
});

app.post('/cadastrar_entrega', (req, res) => {
  const { userId, atividadeId, notaEntrega } = req.body;
  if (!userId || !atividadeId || !notaEntrega) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }
  const sql = `INSERT INTO entregas (userId, activityId, nota, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())`;
  connection.query(sql, [userId, atividadeId, notaEntrega], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar entrega:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
    res.status(200).json({ message: 'Entrega cadastrada com sucesso' });
  });
});



function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  //console.log('Token recebido:', token); 

  if (!token) {
    console.log('Token não fornecido');
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      console.log('Erro ao verificar token:', err.message); 
      return res.status(401).json({ message: 'Token inválido' });
    }

    console.log('Token verificado com sucesso:', decoded); 
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
      const token = jwt.sign({ userId: userId }, 'secreto', { expiresIn: '10m' });
      res.status(200).json({ token: token });
    } else {
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


app.get("/deliveries", verificarToken,(req, res) => {
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
