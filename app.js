const express = require("express");
const mysql = require("mysql");

const app = express();

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

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
