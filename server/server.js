const path = require('path');

require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 


const app = express();
const staticPath = path.join(__dirname, '..', 'client'); 
console.log('Ruta estática generada:', staticPath);      
app.use(express.static(staticPath));

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '..', 'client')));



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Conectado con éxito.'))
    .catch(err => console.error('Error de conexión a MongoDB:', err.message));

const reportesRoutes = require('./routes/reportes');

app.use('/api/reportes', reportesRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor Express en funcionamiento: http://localhost:${PORT}`));