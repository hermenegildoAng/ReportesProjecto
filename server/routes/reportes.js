const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');

const multer = require('multer'); 
const path = require('path'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('evidenciaFoto'), async (req, res) => {
    try {
        const data = {
            ...req.body,
            
            fotoRuta: req.file ? req.file.path : null 
        };

        const nuevoReporte = new Reporte(data);
        const reporteGuardado = await nuevoReporte.save();
        res.status(201).json(reporteGuardado);
    } catch (error) {
       
    }
});

router.get('/', async (req, res) => {
    try {
        const reportes = await Reporte.find().sort({ fechaCreacion: -1 });
        res.json(reportes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reportes' });
    }
});



router.put('/:id', async (req, res) => {
    try {
        
        const reporte = await Reporte.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        );
        if (!reporte) return res.status(404).send('Reporte no encontrado');
        res.json(reporte);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const reporte = await Reporte.findByIdAndUpdate(
            req.params.id,
            
            { status: req.body.status }, 
            { new: true } 
        );
        if (!reporte) return res.status(404).send('Reporte no encontrado');
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado' });
    }
});




module.exports = router;