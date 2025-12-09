
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

app.use(cors()); 
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Conectado con éxito.'))
    .catch(err => console.error('Error de conexión a MongoDB:', err.message));

const reportesRoutes = require('./routes/reportes');

app.use('/api/reportes', reportesRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor Express en funcionamiento: http://localhost:${PORT}`));