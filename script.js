// ==========================================
// CONFIGURACIÓN DE GOOGLE SHEETS (PEÑA T2S1)
// ==========================================
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbxS8S0NzL3sXVdYTnUw5-nnu_a28WQjHXdnhhOH2kzFZ5SdlmkhKhGcH8hPSGVyzg29EA/exec";

// --- DATOS DE LOS EQUIPOS PARA LAS ZONAS ---
const equiposOccidentales = ["Pinar del Río", "Isla de la Juventud", "Mayabeque", "Artemisa", "Industriales", "Matanzas", "Cienfuegos", "Villa Clara"];
const equiposOrientales = ["Sancti Spíritus", "Ciego de Ávila", "Camagüey", "Las Tunas", "Holguín", "Granma", "Guantánamo", "Santiago de Cuba"];

// --- LÓGICA DE PESTAÑAS ---
function cambiarPestana(idPestana, boton) {
    const pestanas = document.querySelectorAll('.tab-content');
    pestanas.forEach(p => p.classList.remove('active'));
    const botones = document.querySelectorAll('.nav-btn');
    botones.forEach(b => b.classList.remove('active'));
    document.getElementById(idPestana).classList.add('active');
    boton.classList.add('active');
}

// --- INICIO ---
window.onload = function() {
    const nombreGuardado = localStorage.getItem('nombrePenaT2S1');
    const equipoGuardado = localStorage.getItem('equipoPenaT2S1');
    
    if (nombreGuardado) {
        document.getElementById('userName').value = nombreGuardado;
        document.getElementById('saludo').textContent = `Hola, ${nombreGuardado}!`;
        if (equipoGuardado) document.getElementById('equipoFavorito').value = equipoGuardado;
    }
    
    renderizarZonas();
    cargarTablaEnVivo();
};

// --- GUARDAR PERFIL ---
function guardarPerfil() {
    const nombre = document.getElementById('userName').value.trim();
    const equipo = document.getElementById('equipoFavorito').value;

    if (nombre === "") { alert("Por favor, ingresa tu nombre."); return; }
    if (equipo === "") { alert("Por favor, selecciona tu equipo favorito."); return; }

    localStorage.setItem('nombrePenaT2S1', nombre);
    localStorage.setItem('equipoPenaT2S1', equipo);
    
    document.getElementById('saludo').textContent = `Hola, ${nombre}! Tu equipo es ${equipo}.`;
    alert(`¡Perfil guardado! Bienvenido, ${nombre} (Fan de ${equipo}).`);
    
    cargarTablaEnVivo();
}

// --- FUNCIÓN PARA ENVIAR DATOS ---
function enviarAGoogle(datos) {
    if (URL_APPS_SCRIPT === "") { alert("⚠️ Falta configurar la URL de Google."); return; }
    
    fetch(URL_APPS_SCRIPT, {
        method: 'POST',
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(res => {
        if (res.result === "success") {
            alert("¡Guardado exitosamente en la nube!");
            cargarTablaEnVivo();
        } else {
            alert("Hubo un error al guardar en la nube.");
            console.error(res);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error de conexión. Revisa tu internet.");
    });
}

// --- GUARDAR PRONÓSTICOS DE PLAYOFFS ---
function guardarPronosticosPlayoffs() {
    const nombre = localStorage.getItem('nombrePenaT2S1');
    const equipo = localStorage.getItem('equipoPenaT2S1');
    
    if (!nombre) { alert("Primero guarda tu nombre en la pestaña de Inicio."); return; }

    const datos = {
        nombre: nombre,
        equipo: equipo || "Sin equipo",
        tipo: "Playoffs",
        occ_1_2: `${document.getElementById('occ_1_vs_2').value}-${document.getElementById('occ_2_vs_1').value}`,
        occ_3_4: `${document.getElementById('occ_3_vs_4').value}-${document.getElementById('occ_4_vs_3').value}`,
        occ_repe: `${document.getElementById('occ_repechaje_a').value}-${document.getElementById('occ_repechaje_b').value}`,
        occ_final: `${document.getElementById('occ_final_a').value}-${document.getElementById('occ_final_b').value}`,
        or_1_2: `${document.getElementById('or_1_vs_2').value}-${document.getElementById('or_2_vs_1').value}`,
        or_3_4: `${document.getElementById('or_3_vs_4').value}-${document.getElementById('or_4_vs_3').value}`,
        or_repe: `${document.getElementById('or_repechaje_a').value}-${document.getElementById('or_repechaje_b').value}`,
        or_final: `${document.getElementById('or_final_a').value}-${document.getElementById('or_final_b').value}`,
        gran_final: `${document.getElementById('nacional_occ').value}-${document.getElementById('nacional_or').value}`,
        zona_occ: "-", zona_or: "-", campeon: "-", subcampeon: "-"
    };

    enviarAGoogle(datos);
}

// --- GUARDAR ZONAS ---
function guardarZonas() {
    const nombre = localStorage.getItem('nombrePenaT2S1');
    const equipo = localStorage.getItem('equipoPenaT2S1');
    if (!nombre) { alert("Primero guarda tu nombre en la pestaña de Inicio."); return; }

    const ordenOcc = [...document.querySelectorAll('#zona-occidental li')].map(li => li.textContent).join(" > ");
    const ordenOr = [...document.querySelectorAll('#zona-oriental li')].map(li => li.textContent).join(" > ");

    const datos = {
        nombre: nombre, equipo: equipo || "Sin equipo", tipo: "Zonas",
        occ_1_2: "-", occ_3_4: "-", occ_repe: "-", occ_final: "-",
        or_1_2: "-", or_3_4: "-", or_repe: "-", or_final: "-",
        gran_final: "-", zona_occ: ordenOcc, zona_or: ordenOr,
        campeon: "-", subcampeon: "-"
    };

    enviarAGoogle(datos);
}

// --- GUARDAR BONUS ---
function guardarBonus() {
    const nombre = localStorage.getItem('nombrePenaT2S1');
    const equipo = localStorage.getItem('equipoPenaT2S1');
    if (!nombre) { alert("Primero guarda tu nombre en la pestaña de Inicio."); return; }
    
    const campeon = document.getElementById('campeonSelect').value;
    const subcampeon = document.getElementById('subcampeonSelect').value;

    if (!campeon || !subcampeon) { alert("Debes seleccionar un Campeón y un Subcampeón."); return; }
    if (campeon === subcampeon) { alert("El Campeón y el Subcampeón no pueden ser el mismo equipo."); return; }

    const datos = {
        nombre: nombre, equipo: equipo || "Sin equipo", tipo: "Bonus",
        occ_1_2: "-", occ_3_4: "-", occ_repe: "-", occ_final: "-",
        or_1_2: "-", or_3_4: "-", or_repe: "-", or_final: "-",
        gran_final: "-", zona_occ: "-", zona_or: "-",
        campeon: campeon, subcampeon: subcampeon
    };

    enviarAGoogle(datos);
}

// --- LÓGICA DE ARRASTRAR Y SOLTAR (ZONAS) ---
function renderizarZonas() {
    const zonaOcc = document.getElementById('zona-occidental');
    const zonaOr = document.getElementById('zona-oriental');
    if(!zonaOcc || !zonaOr) return;

    zonaOcc.innerHTML = '';
    zonaOr.innerHTML = '';

    equiposOccidentales.forEach(eq => {
        const li = document.createElement('li');
        li.draggable = true;
        li.textContent = eq;
        configurarDrag(li);
        zonaOcc.appendChild(li);
    });

    equiposOrientales.forEach(eq => {
        const li = document.createElement('li');
        li.draggable = true;
        li.textContent = eq;
        configurarDrag(li);
        zonaOr.appendChild(li);
    });
}

function configurarDrag(elemento) {
    elemento.addEventListener('dragstart', () => elemento.classList.add('dragging'));
    elemento.addEventListener('dragend', () => elemento.classList.remove('dragging'));
}

document.addEventListener('dragover', e => {
    e.preventDefault();
    const lista = e.target.closest('.drag-list');
    if (!lista) return;
    const dragging = document.querySelector('.dragging');
    if (!dragging) return;
    const afterElement = getDragAfterElement(lista, e.clientY);
    if (afterElement == null) {
        lista.appendChild(dragging);
    } else {
        lista.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- LEER Y DIBUJAR LA TABLA ---
function cargarTablaEnVivo() {
    if (URL_APPS_SCRIPT === "") return;

    fetch(URL_APPS_SCRIPT)
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('leaderboard-body');
        const usuariosReales = data.filter(user => user.Nombre && user.Nombre !== "");

        if (usuariosReales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Aún no hay puntuaciones.</td></tr>';
            return;
        }

        usuariosReales.sort((a, b) => (parseFloat(b.Puntos) || 0) - (parseFloat(a.Puntos) || 0));

        tbody.innerHTML = '';
        const nombreActual = localStorage.getItem('nombrePenaT2S1');

        usuariosReales.forEach((user, index) => {
            const tr = document.createElement('tr');
            if (user.Nombre === nombreActual) {
                tr.style.backgroundColor = "#eef2f5";
                tr.style.fontWeight = "bold";
            }

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.Nombre} ${user.Nombre === nombreActual ? '(Tú)' : ''}</td>
                <td>${user.Equipo || '-'}</td>
                <td>${user.PJ || 0}</td>
                <td>${user.Ganadores || 0}</td>
                <td>${user.Exactos || 0}</td>
                <td><strong>${user.Puntos || 0}</strong></td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error("Error tabla:", error);
    });
}
