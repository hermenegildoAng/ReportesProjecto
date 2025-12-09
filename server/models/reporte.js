

const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['RESIDUOS', 'AGUA', 'INFRAESTRUCTURA']
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 10
    },
    ubicacionLat: {
        type: Number,
        required: true
    },
    ubicacionLng: {
        type: Number, 
        required: true
    },
    
    fotoRuta: {
        type: String, 
        required: false 
    },

    status: {
        type: String,
        default: 'Pendiente',
        enum: ['Pendiente', 'En Progreso', 'Resuelto']
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reporte', reporteSchema);