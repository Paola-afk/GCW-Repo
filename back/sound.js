// sounds.js

// Sonidos para cada power-up
const powerUpSounds = {
    "empuje": new Audio('../assets/sounds/sound1.mp3'),
    "velocidad": new Audio('../assets/sounds/sound2.wav'),
    "inmunidad": new Audio('../assets/sounds/sound3.wav')
};

// Función para reproducir el sonido de un power-up específico
export function playPowerUpSound(type) {
    const sound = powerUpSounds[type];

    if (sound) {
        sound.currentTime = 0;  // Reiniciar el sonido si está pausado
        sound.volume = localStorage.getItem('soundVolume') 
            ? parseFloat(localStorage.getItem('soundVolume')) 
            : 1.0; // Usar volumen guardado o por defecto
        sound.play().catch((error) => {
            console.warn('Error al reproducir el efecto de sonido:', error);
        });
    } else {
        console.warn('Sonido no encontrado para el tipo de power-up:', type);
    }
}

// Función para actualizar el volumen de los efectos de sonido
export function setSoundVolume(volume) {
    Object.values(powerUpSounds).forEach(sound => {
        sound.volume = volume;
    });
    localStorage.setItem('soundVolume', volume); // Guardar volumen en localStorage
}
