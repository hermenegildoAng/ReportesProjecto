const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadDir = path.join(__dirname, '..', 'uploads'); // Ruta correcta
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Carpeta de uploads creada en: ${uploadDir}`);
}

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

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'reportes_projecto_evidencia',
        allowed_formats: ['jpeg', 'png', 'jpg'], 
        transformation: [{ width: 500, height: 500, crop: "limit" }] 
    }
});

const upload = multer({ storage: storage });