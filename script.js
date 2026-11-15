// ==========================================
// CONFIGURACIÓN DE GOOGLE SHEETS (PEÑA T2S1)
// ==========================================
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbyw3W_5Or3TykyvIbZLyCJQ2sN182LCCn5_xeLbEeqU_Zy5OgEudRVzqKd8OvHgVYfmaA/exec";

// --- INICIO ---
window.onload = function() {
    const nombreGuardado = localStorage.getItem('nombrePenaT2S1');
    if (nombreGuardado) {
        document.getElementById('userName').value = nombreGuardado;
        document.getElementById('saludo').textContent = `Hola, ${nombreGuardado}!`;
        mostrarPronosticos();
    }
    cargarTablaEnVivo(); // Cargamos la tabla al abrir
};

// --- LÓGICA DE USUARIO ---
function guardarNombre() {
    const nombre = document.getElementById('userName').value.trim();
    if (nombre === "") {
        alert("Por favor, ingresa un nombre válido.");
        return;
    }
    localStorage.setItem('nombrePenaT2S1', nombre);
    document.getElementById('saludo').textContent = `Hola, ${nombre}!`;
    mostrarPronosticos();
    cargarTablaEnVivo();
    alert(`¡Bienvenido a la Peña T2S1, ${nombre}!`);
}

function mostrarPronosticos() {
    document.getElementById('predictions-section').style.display = 'block';
    document.getElementById('bonus-section').style.display = 'block';
}

// --- FUNCIÓN PARA ENVIAR DATOS A GOOGLE ---
function enviarAGoogle(datos) {
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
    if (!nombre) { alert("Primero guarda tu nombre."); return; }

    const datos = {
        nombre: nombre,
        tipo: "Playoffs",
        occ_1_2: `${document.getElementById('occ_1_vs_2').value}-${document.getElementById('occ_2_vs_1').value}`,
        occ_3_4: `${document.getElementById('occ_3_vs_4').value}-${document.getElementById('occ_4_vs_3').value}`,
        occ_repe: `${document.getElementById('occ_repechaje_a').value}-${document.getElementById('occ_repechaje_b').value}`,
        occ_final: `${document.getElementById('occ_final_a').value}-${document.getElementById('occ_final_b').value}`,
        or_1_2: `${document.getElementById('or_1_vs_2').value}-${document.getElementById('or_2_vs_1').value}`,
        or_3_4: `${document.getElementById('or_3_vs_4').value}-${document.getElementById('or_4_vs_3').value}`,
        or_repe: `${document.getElementById('or_repechaje_a').value}-${document.getElementById('or_repechaje_b').value}`,
        or_final: `${document.getElementById('or_final_a').value}-${document.getElementById('or_final_b').value}`,
        gran_final: `${document.getElementById('nacional_occ').value}-${document.getElementById('nacional_or').value}`
    };

    enviarAGoogle(datos);
}

// --- GUARDAR BONUS ---
function guardarBonus() {
    const nombre = localStorage.getItem('nombrePenaT2S1');
    if (!nombre) { alert("Primero guarda tu nombre."); return; }
    
    const campeon = document.getElementById('campeonSelect').value;
    const subcampeon = document.getElementById('subcampeonSelect').value;

    if (!campeon || !subcampeon) { alert("Debes seleccionar un Campeón y un Subcampeón."); return; }
    if (campeon === subcampeon) { alert("El Campeón y el Subcampeón no pueden ser el mismo equipo."); return; }

    const datos = {
        nombre: nombre,
        tipo: "Bonus",
        occ_1_2: `Campeón: ${campeon}`,
        occ_3_4: `Subcampeón: ${subcampeon}`,
        occ_repe: "-", occ_final: "-", or_1_2: "-", or_3_4: "-", or_repe: "-", or_final: "-", gran_final: "-"
    };

    enviarAGoogle(datos);
}

// --- LEER Y DIBUJAR LA TABLA EN VIVO ---
function cargarTablaEnVivo() {
    fetch(URL_APPS_SCRIPT)
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('leaderboard-body');
        
        // Filtramos para que no salgan filas vacías si las hay en el Excel
        const usuariosReales = data.filter(user => user.Nombre && user.Nombre !== "");

        if (usuariosReales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Aún no hay puntuaciones en la tabla.</td></tr>';
            return;
        }

        // Ordenamos por Puntos (Columna O)
        usuariosReales.sort((a, b) => (parseFloat(b.Puntos) || 0) - (parseFloat(a.Puntos) || 0));

        tbody.innerHTML = '';
        const nombreActual = localStorage.getItem('nombrePenaT2S1');

        usuariosReales.forEach((user, index) => {
            const tr = document.createElement('tr');
            
            // Resaltar al usuario actual
            if (user.Nombre === nombreActual) {
                tr.style.backgroundColor = "#eef2f5";
                tr.style.fontWeight = "bold";
            }

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.Nombre} ${user.Nombre === nombreActual ? '(Tú)' : ''}</td>
                <td>${user.PJ || 0}</td>
                <td>${user.Ganadores || 0}</td>
                <td>${user.Exactos || 0}</td>
                <td><strong>${user.Puntos || 0}</strong></td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error("Error al cargar la tabla:", error);
        document.getElementById('leaderboard-body').innerHTML = `
            <tr><td colspan="6" style="text-align: center; color: red;">Error al conectar con el Excel. Revisa la consola (F12).</td></tr>
        `;
    });
}