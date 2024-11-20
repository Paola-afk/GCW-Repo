// music.js
let audio;

// Verificar si ya existe una instancia global de la música
if (!window.backgroundMusic) {
    audio = new Audio('../assets/audio/MeowMadness.mp3'); // Ruta de tu música
    audio.loop = true; // Hacer que la música se repita
    audio.volume = localStorage.getItem('audioVolume') 
        ? parseFloat(localStorage.getItem('audioVolume')) 
        : 1.0; // Usar el volumen guardado o un valor por defecto
    audio.play();

    // Guardar referencia global para mantenerla entre pantallas
    window.backgroundMusic = audio;

     // Persiste el estado entre recargas
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('isAudioPlaying', !audio.paused);
    });

} else {
    // Si ya existe, reutilizar la instancia
    audio = window.backgroundMusic;
}

// Restablece el estado de reproducción
const isPlaying = localStorage.getItem('isAudioPlaying');
if (isPlaying === 'true') {
    audio.play();
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
