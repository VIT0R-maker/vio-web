const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

//dados simbólicos
const eventos = [
    {
        id: 1,
        nome: "Festival de Tecnologia",
        descricao: "Evento sobre tecnologia, inovação e desenvolvimento.",
        data: "2026-10-20",
        local: "São Paulo",
        preco: 50.00
    },
    {
        id: 2,
        nome: "Show VIO",
        descricao: "Apresentação musical promovida pelo sistema VIO.",
        data: "2026-11-10",
        local: "Campinas",
        preco: 80.00
    },
    {
        id: 3,
        nome: "Encontro de Desenvolvedores",
        descricao: "Evento voltado para desenvolvimento de software.",
        data: "2026-11-25",
        local: "São Caetano do Sul",
        preco: 35.00
    }
];

app.get("/", (req, res) => {
    res.send("API VIO funcionando!");
});

app.get("/api/status", (req, res) => {

    res.json({
        projeto: "VIO Web",
        status: "online",
        mensagem: "API executando corretamente."
    });

});

app.get("/api/eventos", (req, res) => {

    res.json(eventos);

});

app.get("/api/eventos/:id", (req, res) => {

    const id = Number(req.params.id);

    const evento = eventos.find(
        evento => evento.id === id
    );

    if (!evento) {

        return res.status(404).json({
            mensagem: "Evento não encontrado."
        });

    }

    res.json(evento);

});

app.listen(PORT, () => {

    console.log(
        `API VIO executando em http://localhost:${PORT}`
    );

});