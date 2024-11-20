//hola
let audio;

// Verificar si ya existe una instancia global de la música
if (!window.backgroundMusic) {
    audio = new Audio('../assets/audio/MeowMadness.mp3'); // Ruta de tu música
    audio.loop = true; // Hacer que la música se repita
    audio.volume = localStorage.getItem('audioVolume') 
        ? parseFloat(localStorage.getItem('audioVolume')) 
        : 1.0; // Usar el volumen guardado o un valor por defecto

    // Guardar referencia global para mantenerla entre pantallas
    window.backgroundMusic = audio;

    // Intentar reproducir al cargar la pantalla
    audio.play().catch((error) => {
        console.warn('No se pudo iniciar la música automáticamente:', error);
        // Mostrar mensaje para que el usuario desbloquee el audio
        showAudioUnlockMessage();
    });

    // Persistir el estado entre recargas
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('isAudioPlaying', !audio.paused);
    });
} else {
    // Si ya existe, reutilizar la instancia
    audio = window.backgroundMusic;

    // Intentar reproducir al cargar la pantalla
    audio.play().catch((error) => {
        console.warn('No se pudo iniciar la música automáticamente:', error);
        showAudioUnlockMessage();
    });
}

// Mostrar mensaje para desbloquear el audio
function showAudioUnlockMessage() {
    const unlockMessage = document.createElement('div');
    unlockMessage.innerText = 'Haz clic o presiona una tecla para habilitar el audio.';
    unlockMessage.style.position = 'fixed';
    unlockMessage.style.top = '50%';
    unlockMessage.style.left = '50%';
    unlockMessage.style.transform = 'translate(-50%, -50%)';
    unlockMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    unlockMessage.style.color = 'white';
    unlockMessage.style.padding = '20px';
    unlockMessage.style.borderRadius = '10px';
    unlockMessage.style.zIndex = '1000';
    document.body.appendChild(unlockMessage);

    const enableAudio = () => {
        audio.play().catch((error) => {
            console.warn('Error al intentar reproducir audio:', error);
        });
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
        unlockMessage.remove();
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);
}

// Exportar una función para actualizar el volumen
export function setMusicVolume(volume) {
    if (audio) {
        audio.volume = volume;
        localStorage.setItem('audioVolume', volume); // Guardar en localStorage
    }
}

// Exportar la música si necesitas controlarla directamente
export { audio as backgroundMusic };
