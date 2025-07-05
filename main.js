// Sistema de niveles con progresión de dificultad
const niveles = [
    {
      // Nivel 1-5: Fácil - Opciones muy obvias
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
    {
      // Nivel 6-10: Medio - Opciones menos obvias
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
    {
      // Nivel 11-15: Difícil - Opciones similares
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
  
  // Variables del juego
  let nivelActual = 0;
  let tiempoRestante;
  let timer;
  let puntos = 0;
  let vidas = 3;
  let record = localStorage.getItem('record') || 0;
  
  // Elementos del DOM
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
  
  // Iniciar juego
  function iniciarJuego() {
    nivelActual = 0;
    puntos = 0;
    vidas = 3;
    actualizarUI();
    gameContent.style.display = "block";
    gameOverScreen.style.display = "none";
    cargarNivel();
  }
  
  // Cargar nivel
  function cargarNivel() {
    clearInterval(timer);
    const nivel = niveles[nivelActual];
    tiempoRestante = nivel.tiempo;
    
    // Actualizar UI
    nivelSpan.textContent = nivelActual + 1;
    tiempoBar.style.width = "100%";
    tiempoBar.style.backgroundColor = "#FF9800";
    feedbackText.textContent = "";
    explicacionDiv.textContent = "";
    siguienteBtn.style.display = "none";
    
    // Mostrar progreso
    progressBar.style.width = `${(nivelActual / niveles.length) * 100}%`;
    
    // Mostrar opciones
    opcionesDiv.innerHTML = "";
    nivel.opciones.forEach(opcion => {
      const btn = document.createElement("div");
      btn.textContent = opcion;
      btn.classList.add("opcion");
      btn.onclick = () => verificarRespuesta(opcion, btn);
      opcionesDiv.appendChild(btn);
    });
    
    // Iniciar temporizador
    timer = setInterval(() => {
      tiempoRestante -= 0.1;
      tiempoBar.style.width = `${(tiempoRestante / nivel.tiempo) * 100}%`;
      
      // Cambiar color cuando queda poco tiempo
      if (tiempoRestante <= nivel.tiempo * 0.3) {
        tiempoBar.style.backgroundColor = "#F44336";
      }
      
      if (tiempoRestante <= 0) {
        clearInterval(timer);
        tiempoAgotado();
      }
    }, 100);
  }
  
  // Verificar respuesta
  function verificarRespuesta(opcion, elemento) {
    clearInterval(timer);
    const nivel = niveles[nivelActual];
    
    // Deshabilitar todas las opciones
    document.querySelectorAll('.opcion').forEach(btn => {
      btn.style.pointerEvents = 'none';
    });
    
    if (opcion === nivel.correcta) {
      // Respuesta correcta
      elemento.classList.add("correcta");
      feedbackText.textContent = "✅ ¡Correcto!";
      puntos += Math.floor(tiempoRestante * 10); // Más puntos por responder rápido
      actualizarUI();
    } else {
      // Respuesta incorrecta
      elemento.classList.add("incorrecta");
      feedbackText.textContent = "❌ Incorrecto";
      vidas--;
      actualizarUI();
      
      // Resaltar la respuesta correcta
      document.querySelectorAll('.opcion').forEach(btn => {
        if (btn.textContent === nivel.correcta) {
          btn.classList.add("correcta");
        }
      });
      
      if (vidas <= 0) {
        finDelJuego();
        return;
      }
    }
    
    // Mostrar explicación
    explicacionDiv.textContent = nivel.explicacion;
    siguienteBtn.style.display = "block";
  }
  
  // Tiempo agotado
  function tiempoAgotado() {
    feedbackText.textContent = "⏰ ¡Tiempo agotado!";
    vidas--;
    actualizarUI();
    
    // Resaltar la respuesta correcta
    const nivel = niveles[nivelActual];
    document.querySelectorAll('.opcion').forEach(btn => {
      if (btn.textContent === nivel.correcta) {
        btn.classList.add("correcta");
      }
      btn.style.pointerEvents = 'none';
    });
    
    // Mostrar explicación
    explicacionDiv.textContent = nivel.explicacion;
    
    if (vidas <= 0) {
      finDelJuego();
    } else {
      siguienteBtn.style.display = "block";
    }
  }
  
  // Siguiente nivel
  siguienteBtn.onclick = () => {
    nivelActual++;
    if (nivelActual < niveles.length) {
      cargarNivel();
    } else {
      juegoCompletado();
    }
  };
  
  // Fin del juego (por perder todas las vidas)
  function finDelJuego() {
    gameContent.style.display = "none";
    gameOverScreen.style.display = "block";
    finalScoreSpan.textContent = puntos;
    
    // Actualizar récord si es necesario
    if (puntos > record) {
      record = puntos;
      localStorage.setItem('record', record);
    }
    recordSpan.textContent = record;
  }
  
  // Juego completado (todos los niveles)
  function juegoCompletado() {
    puntos += 1000; // Bonus por completar todos los niveles
    actualizarUI();
    
    gameContent.style.display = "none";
    gameOverScreen.style.display = "block";
    finalScoreSpan.textContent = puntos;
    
    // Actualizar récord si es necesario
    if (puntos > record) {
      record = puntos;
      localStorage.setItem('record', record);
    }
    recordSpan.textContent = record;
    
    // Mensaje especial por completar el juego
    document.querySelector('#game-over h2').textContent = "🎉 ¡Felicidades! Has completado el juego";
  }
  
  // Actualizar UI (puntos y vidas)
  function actualizarUI() {
    puntosSpan.textContent = puntos;
    
    // Actualizar vidas
    let vidasHTML = "";
    for (let i = 0; i < 3; i++) {
      vidasHTML += i < vidas ? "❤️" : "♡";
    }
    vidasDiv.innerHTML = vidasHTML;
  }
  
  // Reiniciar juego
  reiniciarBtn.onclick = iniciarJuego;
  
  // Iniciar el juego al cargar
  document.addEventListener('DOMContentLoaded', iniciarJuego);