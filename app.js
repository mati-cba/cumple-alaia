// Configuración de Supabase
const SUPABASE_URL = 'https://diltvzdjaiwcfrbrwvkr.supabase.co';
// IMPORTANTE: Reemplaza con tu Publishable Key real de Supabase
const SUPABASE_ANON_KEY = 'sb_publishable_qXuPeM0tiVbNtS8Ezsr8bg_lxdaVkJV'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variables de estado del formulario
let asistenciaSeleccionada = null;

const optionBtns = document.querySelectorAll('.option-btn');
const form = document.getElementById('attendance-form');
const responseMessage = document.getElementById('response-message');

// Manejo visual de la selección de los botones Sí / No
optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        optionBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        asistenciaSeleccionada = btn.getAttribute('data-value'); // 'si' o 'no'
    });
});

// Envío del formulario a Supabase
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();

    if (!asistenciaSeleccionada) {
        mostrarMensaje('Por favor, indicanos si vas a venir seleccionando una opción.', 'error');
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        // Inserción adaptada a tu tabla 'confirmaciones' y columna 'asiste'
        const { data, error } = await supabaseClient
            .from('confirmaciones')
            .insert([
                { 
                    nombre: nombre, 
                    apellido: apellido, 
                    asiste: asistenciaSeleccionada === 'si' 
                }
            ]);

        if (error) throw error;

        mostrarMensaje('¡Muchas gracias por confirmar! 🐾 Nos vemos en el cumple de Alaia.', 'success');
        form.reset();
        optionBtns.forEach(b => b.classList.remove('selected'));
        asistenciaSeleccionada = null;

    } catch (error) {
        console.error('Error al guardar:', error.message);
        mostrarMensaje('Hubo un error al registrar tu respuesta. Intentalo de nuevo.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmar 🐾';
    }
});

function mostrarMensaje(texto, tipo) {
    responseMessage.textContent = texto;
    responseMessage.className = '';
    responseMessage.classList.add(tipo);
    
    setTimeout(() => {
        responseMessage.classList.add('hidden');
    }, 5000);
}
