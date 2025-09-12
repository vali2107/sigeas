const express = require("express")
const cors = require("cors")
const connection = require("./db_config")
const app = express()

app.use(cors())
app.use(express.json())

const port = 3006

// Login usuário
app.post('/login', (req, res) => {
    let params = Array(
        req.body.email,
        req.body.senha
    );
    const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?;"
    connection.query(query, params, (err, results) => {
        if(results.length > 0) {
            res
            .status(200)
            .json({
                success: true, 
                message: "Login realizado com sucesso", 
                data: results[0]})
        } else {
            res
            .status(400)
            .json({
                success: false, 
                message: "Nome ou senha incorretos"})
        }
    })
})

// cadastrar turma
app.post('/turmas', (req, res) => {
    let params = Array(
        req.body.nome
    );

    let query = "INSERT INTO turmas(nome) VALUES(?);";
    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Turma adicionada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao adicionar turma",
                    data: err
                })
        }
    })
});

// listar turmas
app.get('/turmas', (req, res) => {
    const query = "SELECT * FROM turmas ORDER BY nome ASC";

    connection.query(query, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Turmas carregadas com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar turmas",
                    data: err
                })
        }
    })
});

// editar turma
app.put('/turmas/:id', (req, res) => {
    let params = Array(
        req.body.nome,
        req.params.id
    )
    let query = "UPDATE turmas SET nome=? WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Turma editada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar turma",
                    data: err
                })
        }
    })
});

// deletar turma
app.delete('/turmas/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM turmas WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Turma deletada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar turma",
                    data: err
                })
        }
    })
});



// cadastrar aluno
app.post('/alunos/:id_turma', (req, res) => {
    let params = Array(
        req.body.nome,
        req.body.email,
        req.body.senha,
        req.params.id_turma
    );

    let query = "INSERT INTO usuarios(nome, email, senha, tipo_conta, id_turma) VALUES(?, ?, ?, 'aluno', ?);";
    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Aluno adicionado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao adicionar aluno",
                    data: err
                })
        }
    })
});

// listar alunos
app.get('/alunos/:id_turma', (req, res) => {
    let params = Array(
        req.params.id_turma
    );

    const query = "SELECT * FROM usuarios WHERE id_turma = ? ORDER BY nome ASC";

    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Turmas carregadas com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar turmas",
                    data: err
                })
        }
    })
});

// editar turma
app.put('/alunos/:id', (req, res) => {
    let params = Array(
        req.body.nome,
        req.body.email,
        req.body.senha,
        req.params.id
    )
    let query = "UPDATE usuarios SET nome=?, email=?, senha=? WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Aluno editado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar aluno",
                    data: err
                })
        }
    })
});

// deletar turma
app.delete('/alunos/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM usuarios WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Aluno deletado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar aluno",
                    data: err
                })
        }
    })
});

app.listen(port, () => console.log(`Rodando na porta ${port}`))