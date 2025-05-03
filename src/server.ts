import express = require('express');

const PORT =  process.env.PORT || 3000;
const HOST = 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('Teste de commit');
});

app.listen(PORT);
console.log(`Rodando: ${PORT}`);