const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT;
const apiKey = process.env.API_KEY;

app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'Cidade não informada'});
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
        console.log("URL da requisição:", url);

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Erro na requisição:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados da API" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
