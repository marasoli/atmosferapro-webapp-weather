const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const port = 3000;
const apiWeather = process.env.API_WEATHER;
console.log("API Weather:", apiWeather);

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'Cidade não informada'});
    }

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiWeather}&lang=pt_br`;
        const weatherRes = await axios.get(weatherUrl);
        res.json(weatherRes.data);
        console.log("URL Weather:", weatherUrl);
        
    } catch (error) {
        console.error("Erro na requisição:", error.message);
        res.status(500).json({ error: "Erro ao buscar dados da API" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
