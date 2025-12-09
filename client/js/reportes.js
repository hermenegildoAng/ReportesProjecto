
const API_URL = '/api/reportes';

document.addEventListener('DOMContentLoaded', () => {
    
    cargarReportes();
    configurarModal();
    inicializarMapa

    
});


let mapa; 
let marker; 

function inicializarMapa() {
    
    if (mapa) return; 
    
    
    const defaultCoords = [19.3710966, -97.9096403]; 
    
    
    mapa = L.map('mapaReporte').setView(defaultCoords, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    
    marker = L.marker(defaultCoords).addTo(mapa); 

    
    mapa.on('click', (e) => {
        marker.setLatLng(e.latlng); 
        
        
        document.getElementById('ubicacionLat').value = e.latlng.lat;
        document.getElementById('ubicacionLng').value = e.latlng.lng;
    });

    
    document.getElementById('ubicacionLat').value = defaultCoords[0];
    document.getElementById('ubicacionLng').value = defaultCoords[1];
}

async function cargarReportes() {
    const container = document.getElementById('reportes-container');
    container.innerHTML = '<p>Cargando reportes...</p>';

    try {
        const response = await fetch(API_URL);
        const reportes = await response.json();

        container.innerHTML = ''; 
        
        if (reportes.length === 0) {
            container.innerHTML = '<p>🎉 ¡No hay reportes registrados en este momento!</p>';
            return;
        }

        reportes.forEach(reporte => {
            const card = crearTarjetaReporte(reporte);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar reportes:', error);
        container.innerHTML = '<p class="error-message" style="color: red;"> Error al conectar con el servidor. ¿Está el Back-End (node server.js) corriendo?</p>';
    }
}


function crearTarjetaReporte(reporte) {
    const card = document.createElement('div');
    card.className = `card reporte-${reporte.status.toLowerCase().replace(' ', '-')}`; 
   
    let ubicacionDisplay = "Ubicación no disponible";
    
    if (reporte.ubicacionLat && reporte.ubicacionLng) {
 
        const lat = reporte.ubicacionLat.toFixed(4);
        const lng = reporte.ubicacionLng.toFixed(4);
        ubicacionDisplay = `Coordenadas: ${lat}, ${lng}`;
    }
    
    const statusClass = reporte.status.toLowerCase().replace(' ', '-');
    
    card.innerHTML = `
        <h4 class="card-title">${reporte.tipo}</h4>
        <p class="card-location">
            Ubicación: <strong>${ubicacionDisplay}</strong>
        </p>
        <p class="card-description">${reporte.descripcion.substring(0, 100)}...</p>
        
        <span class="status-badge status-${statusClass}">${reporte.status}</span>
    `;
    
    return card;
}

function configurarModal() {
    const modal = document.getElementById('reporteModal');
    const form = document.getElementById('nuevoReporteForm');
    
    inicializarMapa();
    modal.style.display = 'flex';

    setTimeout(() => {
            if (mapa) {
                mapa.invalidateSize();
                
                if (marker) {
                    mapa.setView(marker.getLatLng(), mapa.getZoom());
                }
            }
    }, 50);
    
    document.getElementById('abrirFormularioBtn').onclick = () => {
        modal.style.display = 'flex'; 
        document.getElementById('mensajeFormulario').textContent = '';
    };
    
    document.getElementById('cerrarModalBtn').onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('tipo', document.getElementById('tipo').value);
        
        formData.append('descripcion', document.getElementById('descripcion').value);
        formData.append('evidenciaFoto', document.getElementById('evidenciaFoto').files[0]);
        formData.append('ubicacionLat', document.getElementById('ubicacionLat').value);
        formData.append('ubicacionLng', document.getElementById('ubicacionLng').value);

        

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                
                body: formData 
            });
           
        } catch (error) {
            
        }
    });
}