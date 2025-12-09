
const API_URL = '/api/reportes';

document.addEventListener('DOMContentLoaded', () => {
    cargarReportesAdmin();
    
});


async function cargarReportesAdmin() {
    const container = document.getElementById('admin-reportes-container');
    container.innerHTML = '<p>Cargando reportes de la base de datos...</p>';

    try {
        const response = await fetch(API_URL);
        const reportes = await response.json();

        container.innerHTML = '';
        if (reportes.length === 0) {
            container.innerHTML = '<p>No hay reportes para gestionar.</p>';
            return;
        }

        reportes.forEach(reporte => {
            const card = crearTarjetaGestion(reporte);
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = '<p class="error-message"> Error de conexión con el servidor. Verifica Node.js.</p>';
    }
}


function crearTarjetaGestion(reporte) {
    const card = document.createElement('div');
    card.className = `card reporte-${reporte.status.toLowerCase().replace(' ', '-')}`;
    
    let ubicacionDisplay = "Ubicación no definida";
    if (reporte.ubicacionLat && reporte.ubicacionLng) {
        const lat = reporte.ubicacionLat.toFixed(4);
        const lng = reporte.ubicacionLng.toFixed(4);
        ubicacionDisplay = `Lat: ${lat}, Lng: ${lng}`;
    }
    
    
    card.innerHTML = `
        <h4 class="card-title">${reporte.tipo} (ID: ${reporte._id.substring(0, 5)})</h4>
        <p class="card-location">Ubicación: <strong>${ubicacionDisplay}</strong></p> 
        <p class="card-description">${reporte.descripcion}</p>
        <p class="card-status">Estado: <span class="status-badge">${reporte.status}</span></p>
        
        <div class="card-actions">
            <button class="btn-status" data-id="${reporte._id}" data-status="${reporte.status}">
                ${reporte.status === 'Resuelto' ? 'Marcar Pendiente' : 'Marcar Resuelto'}
            </button>
            
           

           
        </div>
        <br>
    `;

    

    
    card.querySelector('.btn-status').addEventListener('click', manejarCambioStatus);
    
    

    return card;
}

async function manejarCambioStatus(e) {
    const id = e.target.dataset.id;
    const oldStatus = e.target.dataset.status;
    const newStatus = oldStatus === 'Resuelto' ? 'Pendiente' : 'Resuelto';
    
    if (!confirm(`¿Estás seguro de cambiar el estado de ${oldStatus} a ${newStatus}?`)) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        alert(`Estado actualizado a: ${newStatus}`);
        cargarReportesAdmin(); 
    } catch (error) {
        alert('Error al actualizar el estado.');
    }
}





