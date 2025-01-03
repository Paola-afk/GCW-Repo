import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";


// *** FIREBASE **** //

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0po5j4MfBukAWFINQQryp0LKKZwvpzEY",
  authDomain: "coordenadas-251ea.firebaseapp.com",
  databaseURL: "https://coordenadas-251ea-default-rtdb.firebaseio.com/",
  projectId: "coordenadas-251ea",
  storageBucket: "coordenadas-251ea.firebasestorage.app",
  messagingSenderId: "31232618102",
  appId: "1:31232618102:web:739c3ad3aee30ebf8c7957"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
const provider = new GoogleAuthProvider();


// *** ESCENA *** //
const scene = new THREE.Scene();
scene.background = new THREE.Color("#34495E");

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
  camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 5, -1);
scene.add(directionalLight);



// *** VARIABLES GLOBALES *** //

let currentUser = null;
const latas = [];
const manotas = [];
const estambres = [];
const colisiones = [];
const gatitos = []; // Lista para almacenar todos los gatitos

let velocidadNormal = 1; // Velocidad base del gatito
let velocidadAumentada = 3; // Velocidad aumentada
let velocidadActual = velocidadNormal; // Velocidad activa


// Autentifica el usuario
onAuthStateChanged(auth, (user) => {
  if (user) {
      currentUser = user;
      console.log("Usuario autenticado:", currentUser.uid);

      console.log(currentUser);
  } else {
      console.log("No hay usuario autenticado.");
  }
});



// Función para actualizar solo la posición sin perder los otros datos del usuario
function writeUserData(userId, positionX, positionY, positionZ, rotationY) {
    const userRef = ref(db, "usuarios/" + userId);
    update(userRef, {
        posicion: {
            x: positionX,
            y: positionY,
            z: positionZ
        },
        rotacion: {
            y: rotationY
        }
    });
  }





// Recuperar el valor del "usuario" de localStorage
const usuarioData = localStorage.getItem("usuario");

// Parsear el JSON para obtener los datos como un objeto
const usuario = JSON.parse(usuarioData);

// Obtener el escenario seleccionado
const escenarioSeleccionado = usuario.escenarioSeleccionado;

console.log(escenarioSeleccionado); // Deberías obtener "Bosque" si el usuario lo seleccionó

// Verifica que el escenario actual sea el que ha elegido el usuario
if (escenarioSeleccionado === "Bosque") {
    // Obtener los datos de usuarios desde Firebase
    const usuariosRef = ref(db, "usuarios");

  onValue(usuariosRef, (snapshot) => {
    const usuariosData = snapshot.val();
    if (usuariosData) {
      Object.entries(usuariosData).forEach(([key, value]) => {
        console.log(`${key}: x=${value.posicion.x}, y=${value.posicion.y}, z=${value.posicion.z}`);

        // Verifica si el modelo del usuario ya existe en la escena
        const usuarioModelo = scene.getObjectByName(key);

        if (!usuarioModelo) {
          // Cargar el modelo del gatito
          const loaderGLTF = new GLTFLoader();
          loaderGLTF.load("/Modelos/Gatito-Grande.glb", function (gltf) {
            const gatito = gltf.scene;
            gatito.scale.set(0.7, 0.7, 0.7);  
            gatito.position.set(value.posicion.x, value.posicion.y, value.posicion.z);
            gatito.rotation.y = value.rotacion?.y || 0;
            gatito.name = key;
            scene.add(gatito);
            gatitos.push(gatito); // Agrega el gatito a la lista
          });
        } else {
          // Actualizar la posición del modelo si ya existe
          usuarioModelo.position.set(value.posicion.x, value.posicion.y, value.posicion.z);
          usuarioModelo.rotation.y = value.rotacion?.y || 0; // Actualizar la rotación en Y
        }
      });
    } else {
      console.log("No hay datos de usuarios en Firebase.");
    }
  });
}


//Bosque
const loaderForest = new GLTFLoader();
loaderForest.load("/Modelos/Bosque-PIA.glb", function (model) {
  const forestModel = model.scene;
  forestModel.scale.set(20, 20, 20);
  forestModel.position.set(0, -0.5, 0);
  scene.add(forestModel);
});

//Latas
const loaderCan = new GLTFLoader();
  function cargarLata(x, y, z) {
      loaderCan.load("/Modelos/Lata-PIA.glb", function (model) {
          const canModel = model.scene;
          canModel.name = "Lata"; // Establecer nombre para identificar
          canModel.scale.set(1, 1, 1);
          canModel.position.set(x, y, z);
          scene.add(canModel);
          latas.push(canModel);
      });
  }

  cargarLata(25, 0, 50);
  cargarLata(15, 0, -30);

  //Manotas
  const loaderManotas = new GLTFLoader();
  function cargarManotas(x, y, z) {
    loaderManotas.load("/Modelos/Manotas-PIA.glb", function (model) {
      const manotasModel = model.scene;
      manotasModel.name = "Manotas"; // Establecer nombre para identificar
      manotasModel.scale.set(1, 1, 1);
      manotasModel.position.set(x, y, z);
      scene.add(manotasModel);
      manotas.push(manotasModel);
    });
  }

  cargarManotas(-50, 2, -55);
  cargarManotas(-19, 2, 20);


  const loaderEstambre = new GLTFLoader();
  function cargarEstambre(x, y, z) {
      loaderCan.load("/Modelos/Bola-Estambre.glb", function (model) {
          const estambreModel = model.scene;
          estambreModel.name = "Estambre"; // Establecer nombre para identificar
          estambreModel.scale.set(1, 1, 1);
          estambreModel.position.set(x, y, z);
          scene.add(estambreModel);
          estambres.push(estambreModel);
      });
  }

  cargarEstambre(62, 0.5, -34);
  cargarEstambre(-46, 0.5, 27);

  // let gatitoManotasModel; // Declaración global
  // // Carga del modelo GatitoManotas
  // loaderGLTF.load("/Modelos/GatitoManotas-PIA.glb", function (model) {
  //     gatitoManotasModel = model.scene;
  //     gatitoManotasModel.scale.set(0.7, 0.7, 0.7);
  //     console.log("GatitoManotas cargado", gatitoManotasModel); // Verifica que el modelo se cargó
  // });



  // *** COLISIONES *** //

  // Esta función crea un objeto de colisión
  function crearColision(x, y, z, width, height, depth) {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshBasicMaterial({ visible: false }); // Hacer que la caja de colisión sea completamente invisible
      const collisionBox = new THREE.Mesh(geometry, material);
      collisionBox.position.set(x, y, z);
      scene.add(collisionBox);
      colisiones.push(collisionBox);
  }

  // A COLOOOOOOOOOOOOOOOOOOOOR
  // function crearColision(x, y, z, width, height, depth) {
  //     const geometry = new THREE.BoxGeometry(width, height, depth);
  //     const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
  //     const collisionBox = new THREE.Mesh(geometry, material);
  //     collisionBox.position.set(x, y, z);
  //     scene.add(collisionBox);
  //     colisiones.push(collisionBox);
  // }

  // Llama a crearColision para cada objeto que desees que tenga colisión
  crearColision(-9, 0, 28, 6, 10, 6); // Lata 1
  crearColision(-20, 0, 68, 6, 10, 6); // Lata 1
  crearColision(-38, 0, 75, 6, 10, 6); // Lata 1
  crearColision(-36, 0, 41, 6, 10, 6); // Lata 1
  crearColision(11, 0, 75, 6, 10, 6); // Lata 1
  crearColision(-72, 0, 39, 6, 10, 6); // Lata 1
  crearColision(-68, 0, 26, 6, 10, 6); // Lata aaa
  crearColision(-64, 0, 58, 6, 10, 6); // Lata 1
  crearColision(-66, 0, 72, 6, 10, 6); // Lata 1
  crearColision(77, 0, 72, 6, 10, 6); // Lata 1
  crearColision(78, 0, 41, 6, 10, 6); // Lata 1
  crearColision(75, 0, 15, 6, 10, 6); // Lata 1
  crearColision(75, 0, -11, 6, 10, 6); // Lata 1
  crearColision(68, 0, -34, 6, 10, 6); // Lata 1
  crearColision(72, 0, -50, 6, 10, 6); // Lata 1
  crearColision(68, 0, -77, 6, 10, 6); // Lata 1
  crearColision(41, 0, -76, 6, 10, 6); // Lata 1
  crearColision(17, 0, -76, 6, 10, 6); // Lata bbbbbb
  crearColision(20, 0, -36, 6, 10, 6); // Lata 1
  crearColision(33, 0, -51, 6, 10, 6); // Lata 1
  crearColision(46, 0, -40, 6, 10, 6); // Lata 1
  crearColision(-14, 0, -74, 6, 10, 6); // Lata 1
  crearColision(-35, 0, -73, 6, 10, 6); // Lata 1
  crearColision(-53, 0, -75, 6, 10, 6); // Lata 1
  crearColision(-74, 0, -73, 6, 10, 6); // Lata aaaaaa
  crearColision(-54, 0, -55, 6, 10, 6); // Lata 1
  crearColision(-24, 0, -55, 6, 10, 6); // Lata 1
  crearColision(-45, 0, -32, 6, 10, 6); // Lata 1
  crearColision(-47, 0, -1, 6, 10, 6); // Lata 1
  crearColision(-74, 0, -44, 6, 10, 6); // Lata 1
  crearColision(-74, 0, -26, 6, 10, 6); // Lata 1
  crearColision(-70, 0, -4, 6, 10, 6); // Lata 1
  crearColision(43, 0, 49, 12, 10, 8); // Lata 1
  crearColision(3, 0, -15, 11, 10, 36); // Lata 1

  crearColision(0, 0, -82, 250, 10, 10); // Lata 1
  crearColision(0, 0, 82, 250, 10, 10); // Lata 1
  crearColision(-82, 0, 0, 10, 10, 200); // Lata 1
  crearColision(82, 0, 0, 10, 10, 200); // Lata 1


  function detectarColisiones() {
      gatitos.forEach((gatito) => {
          colisiones.forEach((colision) => {
              const boxGatito = new THREE.Box3().setFromObject(gatito);
              const boxColision = new THREE.Box3().setFromObject(colision);

              if (boxGatito.intersectsBox(boxColision)) {
                  console.log(`¡Colisión detectada para ${gatito.name}!`);

                  // Calcula la dirección del empuje, ignorando el eje Y
                  const direction = new THREE.Vector3()
                      .subVectors(gatito.position, colision.position);

                  direction.y = 0; // Ignorar componente vertical
                  direction.normalize();

                  // Aplica un empuje hacia atrás solo en X y Z
                  gatito.position.add(direction.multiplyScalar(0.5)); // Ajusta la fuerza si es necesario
              }
          });
      });
  }



  // Función para verificar colisiones y eliminar objetos
  function verificarColisiones() {
      // Verificar colisiones para cada gatito
      gatitos.forEach((gatito) => {
          const gatitoPos = gatito.position;

          // Verificar colisión con latas
          for (let i = latas.length - 1; i >= 0; i--) {
              const lata = latas[i];
              const distancia = gatitoPos.distanceTo(lata.position);
              if (distancia < 2) { // Ajusta este valor según el tamaño de tus objetos
                  scene.remove(lata); // Eliminar del escenario
                  latas.splice(i, 1); // Eliminar del array
                  console.log("Lata recogida");
              }
          }

          // Verificar colisión con manotas
          for (let i = manotas.length - 1; i >= 0; i--) {
              const manota = manotas[i];
              const distancia = gatitoPos.distanceTo(manota.position);
              if (distancia < 1.5) { // Ajusta este valor según el tamaño de tus objetos
                  scene.remove(manota); // Eliminar del escenario
                  manotas.splice(i, 1); // Eliminar del array
                  console.log("Manota recogida");
              }
          }

          // Verificar colisión con estambres
          estambres.forEach(estambre => {
            // Calcula la distancia entre el gatito y el estambre
            const distancia = gatitoPos.distanceTo(estambre.position);

            // Si la distancia es suficientemente pequeña, hay colisión
            if (distancia < 2) { // Puedes ajustar el valor de "5" según el tamaño del estambre
              scene.remove(estambre); // Eliminar del escenario
              console.log("Estambre");
              activarVelocidadAumentada();
            }
          });
        });
    }





  // *** POWER UPS *** //

  //Velocidad
  function activarVelocidadAumentada() {
    velocidadActual = velocidadAumentada; // Aumenta la velocidad

    // Después de 5 segundos, vuelve a la velocidad normal
    setTimeout(() => {
      velocidadActual = velocidadNormal; // Restaura la velocidad normal
      console.log("Velocidad restaurada.");
    }, 5000); // 5000 ms = 5 segundos
  }



  // *** TECLADO *** //
  
document.onkeydown = function (e) {
  if (!currentUser || !currentUser.uid) {
      console.error("Usuario no autenticado o currentUser.uid no definido.");
      return;
  }

  // Obtiene el modelo del jugador actual en la escena
  const jugadorActual = scene.getObjectByName(currentUser.uid);

  if (!jugadorActual) {
      console.error("El modelo del jugador actual no está en la escena.");
      return;
  }

  const moveSpeed = 1; // Velocidad de movimiento
  const rotationSpeed = 0.5; // Velocidad de rotación suave
  let rotationY = jugadorActual.rotation.y; // Rotación inicial del jugador
  let posicionModificada = false; // Bandera de movimiento

  // Calculamos la dirección de movimiento en base a la rotación
  const direction = new THREE.Vector3(0, 0, 1); // Dirección frontal
  const rotationMatrix = new THREE.Matrix4(); // Matriz de rotación

  // Manejo de las teclas para movimiento y rotación
  switch (e.keyCode) {
      case 39: // Flecha derecha (rotar a la derecha)
          rotationY -= rotationSpeed; // Rotar a la derecha
          posicionModificada = true;
          break;
      case 37: // Flecha izquierda (rotar a la izquierda)
          rotationY += rotationSpeed; // Rotar a la izquierda
          posicionModificada = true;
          break;
      case 38: // Flecha arriba (mover hacia adelante)
          rotationMatrix.makeRotationY(rotationY); // Crear la matriz de rotación
          direction.applyMatrix4(rotationMatrix); // Aplicar la rotación a la dirección

          // Mover al jugador en la dirección deseada
          jugadorActual.position.x += direction.x * velocidadActual;
          jugadorActual.position.z += direction.z * velocidadActual;
          posicionModificada = true;
          break;
      case 40: // Flecha abajo (mover hacia atrás)
          rotationMatrix.makeRotationY(rotationY); // Crear la matriz de rotación
          direction.applyMatrix4(rotationMatrix); // Aplicar la rotación a la dirección

          // Mover al jugador en la dirección opuesta
          jugadorActual.position.x -= direction.x * velocidadActual;
          jugadorActual.position.z -= direction.z * velocidadActual;
          posicionModificada = true;
          break;
  }

  // Si hubo movimiento o rotación, interpolar la rotación suavemente
  if (posicionModificada) {
      // Interpolamos entre la rotación actual y la deseada
      const deltaRotation = rotationY - jugadorActual.rotation.y;
      if (Math.abs(deltaRotation) > 0.01) { // Ajustamos un umbral para evitar oscilaciones pequeñas
          jugadorActual.rotation.y += deltaRotation * rotationSpeed;
      }

      // Asegúrate de que la posición no sea NaN antes de escribir en Firebase
      if (!isNaN(jugadorActual.position.x) && !isNaN(jugadorActual.position.y) && !isNaN(jugadorActual.position.z) && !isNaN(jugadorActual.rotation.y)) {
          writeUserData(
              currentUser.uid,
              jugadorActual.position.x,
              jugadorActual.position.y,
              jugadorActual.position.z, 
              jugadorActual.rotation.y,
              currentUser
          );
      } else {
          console.error("Posición inválida del jugador:", jugadorActual.position, jugadorActual.rotation);
      }
  }
};


function updateCameraPosition() {
    if (!currentUser || !currentUser.uid) return;

    const jugadorActual = scene.getObjectByName(currentUser.uid);
    if (!jugadorActual) return;

    // Define el offset relativo al jugador (cámara detrás y arriba)
    const offset = new THREE.Vector3(0, 5, -15); // 5 unidades arriba y 10 detrás

    // Aplica la rotación del jugador al offset
    const jugadorRotation = new THREE.Quaternion().setFromEuler(jugadorActual.rotation);
    const offsetRotated = offset.clone().applyQuaternion(jugadorRotation);

    // Calcula la posición deseada de la cámara
    const cameraTargetPosition = jugadorActual.position.clone().add(offsetRotated);

    // Suaviza el movimiento de la cámara hacia la posición deseada
    camera.position.lerp(cameraTargetPosition, 0.1);

    // La cámara siempre mira al jugador
    camera.lookAt(jugadorActual.position);
}



 // Skybox
const loader = new THREE.CubeTextureLoader();
const skyboxTextures = loader.load([
  "/front/images/Sky.png", 
  "/front/images/Sky.png",
  "/front/images/Sky.png",
  "/front/images/Sky.png",
  "/front/images/Sky.png",
  "/front/images/Sky.png",
]);

scene.background = skyboxTextures;

const cameraControl = new OrbitControls(camera, renderer.domElement);

function animate() {
  // updateMovement();
  // // Simulación del movimiento del gatito
  detectarColisiones();
  verificarColisiones();

  updateCameraPosition();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();


