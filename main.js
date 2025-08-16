// ===================== Sistema de niveles =====================
const niveles = [
  // Nivel 1-5: Fácil
  {
    correcta: "Manzana", 
    opciones: ["Manzana", "Hamburguesa"],
    tiempo: 15,
    explicacion: "La manzana es una fruta rica en fibra y vitaminas, mientras que la hamburguesa suele tener alto contenido de grasas saturadas."
  },
  {
    correcta: "Agua", 
    opciones: ["Agua", "Refresco"],
    tiempo: 10,
    explicacion: "El agua es esencial para el cuerpo y no contiene azúcares añadidos como los refrescos."
  },
  {
    correcta: "Ensalada", 
    opciones: ["Ensalada", "Pizza"],
    tiempo: 9,
    explicacion: "La ensalada proporciona vitaminas y minerales con pocas calorías, a diferencia de la pizza que es alta en calorías y grasas."
  },
  {
    correcta: "Zanahoria", 
    opciones: ["Zanahoria", "Papas fritas"],
    tiempo: 9,
    explicacion: "Las zanahorias son ricas en vitamina A y fibra, mientras que las papas fritas contienen grasas trans y mucho sodio."
  },
  {
    correcta: "Pechuga de pollo", 
    opciones: ["Pechuga de pollo", "Hot dog"],
    tiempo: 8,
    explicacion: "La pechuga de pollo es una buena fuente de proteína magra, mientras que los hot dogs contienen procesados y conservantes."
  },
  // Nivel 6-10: Medio
  {
    correcta: "Avena", 
    opciones: ["Avena", "Cereal azucarado"],
    tiempo: 8,
    explicacion: "La avena es un carbohidrato complejo con fibra, mientras que los cereales azucarados contienen azúcares añadidos."
  },
  {
    correcta: "Yogur natural", 
    opciones: ["Yogur natural", "Helado"],
    tiempo: 7,
    explicacion: "El yogur natural tiene probióticos y menos azúcar que el helado."
  },
  {
    correcta: "Pan integral", 
    opciones: ["Pan integral", "Pan blanco"],
    tiempo: 7,
    explicacion: "El pan integral contiene más fibra y nutrientes que el pan blanco refinado."
  },
  {
    correcta: "Almendras", 
    opciones: ["Almendras", "Galletas saladas"],
    tiempo: 6,
    explicacion: "Las almendras contienen grasas saludables y proteínas, mientras que las galletas suelen tener harinas refinadas."
  },
  {
    correcta: "Salmón", 
    opciones: ["Salmón", "Nuggets de pollo"],
    tiempo: 6,
    explicacion: "El salmón es rico en omega-3, mientras que los nuggets suelen ser procesados y fritos."
  },
  // Nivel 11-15: Difícil
  {
    correcta: "Quinoa", 
    opciones: ["Quinoa", "Arroz blanco"],
    tiempo: 5,
    explicacion: "La quinoa es un pseudocereal completo con todos los aminoácidos esenciales, mientras que el arroz blanco ha perdido nutrientes en el refinado."
  },
  {
    correcta: "Aceite de oliva", 
    opciones: ["Aceite de oliva", "Mantequilla"],
    tiempo: 5,
    explicacion: "El aceite de oliva contiene grasas insaturadas beneficiosas, mientras que la mantequilla tiene grasas saturadas."
  },
  {
    correcta: "Edamame", 
    opciones: ["Edamame", "Papas chips"],
    tiempo: 4,
    explicacion: "El edamame es una excelente fuente de proteína vegetal, mientras que las papas chips son altas en grasas y sodio."
  },
  {
    correcta: "Batata", 
    opciones: ["Batata", "Puré instantáneo"],
    tiempo: 4,
    explicacion: "La batata es un carbohidrato complejo con fibra y vitamina A, mientras que el puré instantáneo suele tener aditivos."
  },
  {
    correcta: "Chocolate negro", 
    opciones: ["Chocolate negro", "Chocolate con leche"],
    tiempo: 3,
    explicacion: "El chocolate negro (70% cacao o más) tiene antioxidantes y menos azúcar que el chocolate con leche."
  }
];

// ===================== Estado del juego =====================
let nivelActual = 0;
let tiempoRestante;
let timer;
let puntos = 0;
let vidas = 3;
let record = Number(localStorage.getItem('record') || 0);
let jugadorActual = null;       // { nombre: string }
let ultimoJugadorId = null;     // para resaltar su fila en el podio

// ===================== DOM =====================
const nivelSpan = document.getElementById("nivel");
const tiempoBar = document.getElementById("timer-bar");
const opcionesDiv = document.getElementById("opciones");
const feedbackText = document.getElementById("feedback-text");
const explicacionDiv = document.getElementById("explicacion");
const siguienteBtn = document.getElementById("siguiente");
const puntosSpan = document.getElementById("puntos").querySelector("span");
const vidasDiv = document.getElementById("vidas");
const progressBar = document.getElementById("progress-bar");
const gameContent = document.getElementById("game-content");
const gameOverScreen = document.getElementById("game-over");
const finalScoreSpan = document.getElementById("final-score").querySelector("span");
const recordSpan = document.getElementById("record").querySelector("span");
const reiniciarBtn = document.getElementById("reiniciar");

const seccionRegistro = document.getElementById("registro");
const inputNombre = document.getElementById("nombre-jugador");
const btnRegistrar = document.getElementById("btn-registrar");
const registroMsg = document.getElementById("registro-msg");
const gameContainer = document.getElementById("game-container");

// ===================== Registro jugador =====================
btnRegistrar.addEventListener('click', () => {
  const nombre = (inputNombre.value || "").trim();
  if (!nombre) {
    registroMsg.textContent = "Por favor ingresa tu nombre.";
    inputNombre.focus();
    return;
  }
  if (nombre.length > 20) {
    registroMsg.textContent = "Máximo 20 caracteres.";
    inputNombre.focus();
    return;
  }

  jugadorActual = { nombre };
  ultimoJugadorId = null;
  seccionRegistro.style.display = 'none';
  gameContainer.style.display = 'block';
  iniciarJuego();
});

inputNombre.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnRegistrar.click();
});

// ===================== Juego =====================
function iniciarJuego() {
  nivelActual = 0;
  puntos = 0;
  vidas = 3;
  actualizarUI();
  gameContent.style.display = "block";
  gameOverScreen.style.display = "none";
  document.querySelector('#game-over h2').textContent = "¡Juego Terminado!";
  cargarNivel();
}

function cargarNivel() {
  clearInterval(timer);
  const nivel = niveles[nivelActual];
  tiempoRestante = nivel.tiempo;

  nivelSpan.textContent = nivelActual + 1;
  tiempoBar.style.width = "100%";
  tiempoBar.style.backgroundColor = "#FF9800";
  feedbackText.textContent = "";
  explicacionDiv.textContent = "";
  siguienteBtn.style.display = "none";

  progressBar.style.width = `${(nivelActual / niveles.length) * 100}%`;

  opcionesDiv.innerHTML = "";
  nivel.opciones.forEach(opcion => {
    const btn = document.createElement("div");
    btn.textContent = opcion;
    btn.classList.add("opcion");
    btn.onclick = () => verificarRespuesta(opcion, btn);
    opcionesDiv.appendChild(btn);
  });

  timer = setInterval(() => {
    tiempoRestante -= 0.1;
    tiempoBar.style.width = `${(tiempoRestante / nivel.tiempo) * 100}%`;

    if (tiempoRestante <= nivel.tiempo * 0.3) {
      tiempoBar.style.backgroundColor = "#F44336";
    }

    if (tiempoRestante <= 0) {
      clearInterval(timer);
      tiempoAgotado();
    }
  }, 100);
}

function verificarRespuesta(opcion, elemento) {
  clearInterval(timer);
  const nivel = niveles[nivelActual];

  document.querySelectorAll('.opcion').forEach(btn => {
    btn.style.pointerEvents = 'none';
  });

  if (opcion === nivel.correcta) {
    elemento.classList.add("correcta");
    feedbackText.textContent = "✅ ¡Correcto!";
    puntos += Math.floor(tiempoRestante * 10);
    actualizarUI();
  } else {
    elemento.classList.add("incorrecta");
    feedbackText.textContent = "❌ Incorrecto";
    vidas--;
    actualizarUI();

    document.querySelectorAll('.opcion').forEach(btn => {
      if (btn.textContent === nivel.correcta) btn.classList.add("correcta");
    });

    if (vidas <= 0) {
      finDelJuego();
      return;
    }
  }

  explicacionDiv.textContent = nivel.explicacion;
  siguienteBtn.style.display = "block";
}

function tiempoAgotado() {
  feedbackText.textContent = "⏰ ¡Tiempo agotado!";
  vidas--;
  actualizarUI();

  const nivel = niveles[nivelActual];
  document.querySelectorAll('.opcion').forEach(btn => {
    if (btn.textContent === nivel.correcta) btn.classList.add("correcta");
    btn.style.pointerEvents = 'none';
  });

  explicacionDiv.textContent = nivel.explicacion;

  if (vidas <= 0) {
    finDelJuego();
  } else {
    siguienteBtn.style.display = "block";
  }
}

siguienteBtn.onclick = () => {
  nivelActual++;
  if (nivelActual < niveles.length) {
    cargarNivel();
  } else {
    juegoCompletado();
  }
};

function finDelJuego() {
  gameContent.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScoreSpan.textContent = puntos;

  if (puntos > record) {
    record = puntos;
    localStorage.setItem('record', String(record));
  }
  recordSpan.textContent = record;

  // Guardar en podio y mostrar
  const pos = registrarEnPodio(jugadorActual?.nombre || "Jugador", puntos);
  mostrarPodio(pos);
}

function juegoCompletado() {
  puntos += 1000;
  actualizarUI();

  gameContent.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScoreSpan.textContent = puntos;

  if (puntos > record) {
    record = puntos;
    localStorage.setItem('record', String(record));
  }
  recordSpan.textContent = record;

  document.querySelector('#game-over h2').textContent = "🎉 ¡Felicidades! Has completado el juego";
  const pos = registrarEnPodio(jugadorActual?.nombre || "Jugador", puntos);
  mostrarPodio(pos);
}

function actualizarUI() {
  puntosSpan.textContent = puntos;

  let vidasHTML = "";
  for (let i = 0; i < 3; i++) {
    vidasHTML += i < vidas ? "❤️" : "♡";
  }
  vidasDiv.innerHTML = vidasHTML;
}

reiniciarBtn.onclick = iniciarJuego;

document.addEventListener('DOMContentLoaded', () => {
  // si quieres permitir continuar con último jugador automáticamente:
  // const ultimo = localStorage.getItem('ultimoJugadorNombre');
  // if (ultimo) { jugadorActual = { nombre: ultimo }; seccionRegistro.style.display='none'; gameContainer.style.display='block'; iniciarJuego(); }
});

// ===================== Podio (localStorage) =====================
// Estructura: [{id, nombre, puntaje, fecha}]
const KEY_PODIO = 'podioJugadores';

function getPodio() {
  try {
    const raw = localStorage.getItem(KEY_PODIO);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePodio(lista) {
  localStorage.setItem(KEY_PODIO, JSON.stringify(lista));
}

// Devuelve la posición (1-based) del registro recién guardado
function registrarEnPodio(nombre, puntaje) {
  const id = Date.now() + Math.random().toString(16).slice(2);
  const entrada = { id, nombre, puntaje, fecha: new Date().toISOString() };

  let podio = getPodio();
  podio.push(entrada);

  // Orden: mayor puntaje primero; si empatan, más antiguo primero
  podio.sort((a, b) => {
    if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    return new Date(a.fecha) - new Date(b.fecha);
  });

  savePodio(podio);
  ultimoJugadorId = id;

  // calcular posición
  const index = podio.findIndex(p => p.id === id);
  // guardar último jugador por comodidad (opcional)
  localStorage.setItem('ultimoJugadorNombre', nombre);

  return index >= 0 ? index + 1 : null;
}

function mostrarPodio(posicionActual = null) {
  const podio = getPodio();

  const tbody = document.querySelector('#tabla-podio tbody');
  tbody.innerHTML = '';

  podio.forEach((jugador, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHTML(jugador.nombre)}</td>
      <td>${jugador.puntaje}</td>
    `;

    if (jugador.id === ultimoJugadorId) {
      tr.classList.add('fila-actual');
    }

    tbody.appendChild(tr);
  });

  // Si quieres limitar a top 10 en la vista:
  // while (tbody.rows.length > 10) tbody.deleteRow(10);
}

// Utilidad para evitar inyección en nombre
function escapeHTML(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
