// sounds.js

// Cargar y controlar el volumen de los efectos de sonido
const powerUpSound = new Audio('../assets/sounds/sound3.wav'); // Efecto de sonido para los power-ups

// Función para reproducir el sonido de los power-ups
export function playPowerUpSound() {
    powerUpSound.currentTime = 0; // Reiniciar el sonido si está pausado
    powerUpSound.volume = localStorage.getItem('soundVolume') 
        ? parseFloat(localStorage.getItem('soundVolume')) 
        : 1.0; // Usar volumen guardado o por defecto
    powerUpSound.play().catch((error) => {
        console.warn('Error al reproducir el efecto de sonido:', error);
    });
}

// Función para actualizar el volumen de los efectos de sonido
export function setSoundVolume(volume) {
    powerUpSound.volume = volume;
    localStorage.setItem('soundVolume', volume); // Guardar volumen en localStorage
}
