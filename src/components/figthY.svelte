<script>
    import { onMount } from "svelte";

    const personajes = [
        { id: 1, nombre: "murillo ssjLegend", img: "/MurilloEs.png" },
        { id: 2, nombre: "son murillo", img: "/SonMurillo.png" },
        { id: 3, nombre: "yupiliano", img: "/yupiloverEs.png" },
        { id: 4, nombre: "padre domingo", img: "/PadreDomingo.png" },
        { id: 5, nombre: "avaricia", img: "/jugador.png" },
        { id: 6, nombre: "linternaNegra", img: "/linternaNegra.png" },
    ];

    let personajeSeleccionado = personajes[0];

    const imgJugador = new Image();
    imgJugador.src = personajeSeleccionado.img;
    const sonidoEnemigoF = new Audio("/victoria2.m4a");
    const sonidoGanarF = new Audio("/victoria.mp3");
    let personajeEnemigo = null;

    const imgEnemigo = new Image();
    

    function seleccionarPersonaje(p) {
        personajeSeleccionado = p;
        imgJugador.src = p.img;
    }

    let canvas;
    let ctx;

    let juegoIniciado = false;
    let modo = "CPU";

    const GRAVEDAD = 0.6;
    const FUERZA_SALTO = -12;
    const SUELO = 300;
    const VELOCIDAD = 2;
    let mensajeFinal = "";


    const jugador = {
        x: 100,
        y: SUELO,
        w: 50,
        h: 80,
        vida: 100,
        velY: 0,
        atacando: false,
        cooldown: 0,
        enSuelo: true,
        hitbox: null,
        direccion: 1
    };

    const enemigo = {
        x: 600,
        y: SUELO,
        w: 50,
        h: 80,
        vida: 100,
        velY: 0,
        atacando: false,
        cooldown: 0,
        enSuelo: true,
        hitbox: null,
        direccion: -1
    };

    let keys = {};

    onMount(() => {
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        canvas.focus();
        window.addEventListener("keydown", e => {
            if ([" ", "Enter"].includes(e.key)) {
                e.preventDefault(); // 🔥 CLAVE
            }
            keys[e.key] = true;
        });

        window.addEventListener("keyup", e => {
            keys[e.key] = false;
        });

    });

    function iniciarJuego(tipo) {
        modo = tipo;
        juegoIniciado = true;

        const posibles = personajes.filter(p => p.id !== personajeSeleccionado.id);
        personajeEnemigo = posibles[Math.floor(Math.random() * posibles.length)];
        imgEnemigo.src = personajeEnemigo.img;

        jugador.x = 100;
        jugador.y = SUELO;
        jugador.vida = 100;
        jugador.velY = 0;
        jugador.enSuelo = true;
        jugador.cooldown = 0;

        enemigo.x = 600;
        enemigo.y = SUELO;
        enemigo.vida = 100;
        enemigo.velY = 0;
        enemigo.enSuelo = true;
        enemigo.cooldown = 0;

        setTimeout(() => requestAnimationFrame(loop), 300);
    }

    function loop() {
        if (!juegoIniciado) return;
        update();
        draw();
        requestAnimationFrame(loop);
    }

    function update() {

        if (keys["a"]) {
            jugador.x -= VELOCIDAD
            jugador.direccion = -1;
        };
        if (keys["d"]) {
            jugador.x += VELOCIDAD
            jugador.direccion = 1;
        };

        if (keys["w"] && jugador.enSuelo) {
            jugador.velY = FUERZA_SALTO;
            jugador.enSuelo = false;
        };

        if (keys[" "] && jugador.cooldown <= 0) {
            atacar(jugador, enemigo);
        };


        jugador.velY += GRAVEDAD;
        jugador.y += jugador.velY;

        if (jugador.y >= SUELO) {
            jugador.y = SUELO;
            jugador.velY = 0;
            jugador.enSuelo = true;
        };

        enemigo.velY += GRAVEDAD;
        enemigo.y += enemigo.velY;

        if (enemigo.y >= SUELO) {
            enemigo.y = SUELO;
            enemigo.velY = 0;
            enemigo.enSuelo = true;
        };

        if (modo === "CPU") {
            iaEnemigo();
        } else {
            if (keys["ArrowLeft"]) {
                enemigo.x -= VELOCIDAD
                enemigo.direccion = -1;
            };
            if (keys["ArrowRight"]) {
                enemigo.x += VELOCIDAD
                enemigo.direccion = 1;
            };

            if (keys["ArrowUp"] && enemigo.enSuelo) {
                enemigo.velY = FUERZA_SALTO;
                enemigo.enSuelo = false;
            };

            if (keys["Enter"] && enemigo.cooldown <= 0) {
                atacar(enemigo, jugador);
            };

        };

        if (jugador.cooldown > 0) jugador.cooldown--;
        if (enemigo.cooldown > 0) enemigo.cooldown--;

        if (enemigo.vida <= 0) {
            juegoIniciado = false;
            mensajeFinal = "🏆 ¡Jugador 1 gana!";
            sonidoGanarF.currentTime = 0;
            sonidoGanarF.play();
        }

        if (jugador.vida <= 0) {
           juegoIniciado = false;
            mensajeFinal = modo === "CPU"
                ? "💀 La CPU gana"
                : "🏆 ¡Jugador 2 gana!";
            sonidoEnemigoF.currentTime = 0;
            sonidoEnemigoF.play();
        }
    }

    function atacar(atacante, defensor) {
        atacante.atacando = true;
        atacante.cooldown = 40;

        const offsetX = atacante.direccion === 1
            ? atacante.w
            : -25;

        atacante.hitbox = {
            x: atacante.x + offsetX,
            y: atacante.y + 20,
            w: 25,
            h: 40
        };

        if (
            atacante.hitbox.x < defensor.x + defensor.w &&
            atacante.hitbox.x + atacante.hitbox.w > defensor.x &&
            atacante.hitbox.y < defensor.y + defensor.h &&
            atacante.hitbox.y + atacante.hitbox.h > defensor.y
        ) {
            defensor.vida -= 10;
        }

        setTimeout(() => {
            atacante.atacando = false;
            atacante.hitbox = null;
        }, 250);
    }

    function iaEnemigo() {
        const distancia = Math.abs(enemigo.x - jugador.x);

        if (enemigo.x < jugador.x) {
            enemigo.direccion = 1;
        } else {
            enemigo.direccion = -1;
        }

        if (distancia > 60) {
            enemigo.x += enemigo.direccion * 0.9;
        }

        if (distancia < 50 && enemigo.cooldown <= 0) {
            atacar(enemigo, jugador);
        }

        if (Math.random() < 0.004 && enemigo.enSuelo) {
            enemigo.velY = FUERZA_SALTO;
            enemigo.enSuelo = false;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(imgJugador, jugador.x, jugador.y, jugador.w, jugador.h);
        ctx.drawImage(imgEnemigo, enemigo.x, enemigo.y, enemigo.w, enemigo.h);

        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Vida J1: " + jugador.vida, 20, 30);
        ctx.fillText(
            (modo === "CPU" ? "Vida CPU: " : "Vida J2: ") + enemigo.vida,
            620,
            30
        );
        if (jugador.hitbox) {
            ctx.fillStyle = "rgba(255,255,0,0.6)";
            ctx.fillRect(
                jugador.hitbox.x,
                jugador.hitbox.y,
                jugador.hitbox.w,
                jugador.hitbox.h
            );
        }

        if (enemigo.hitbox) {
            ctx.fillStyle = "rgba(255,0,0,0.6)";
            ctx.fillRect(
                enemigo.hitbox.x,
                enemigo.hitbox.y,
                enemigo.hitbox.w,
                enemigo.hitbox.h
            );
        }
        if (!juegoIniciado && mensajeFinal) {
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.font = "32px Arial";
            ctx.textAlign = "center";
            ctx.fillText(mensajeFinal, canvas.width / 2, canvas.height / 2);

            ctx.textAlign = "left";
        }

    }
    

</script>

<div class="game-wrapper">
  <div class="game-frame">

    <div class="game-header">
      🥊 Yupi Fight
    </div>

    <div class="juego-area">
     
      <canvas id="gameCanvas" width="800" height="450" tabindex="0"></canvas>

    </div>

    <div class="selector-personajes">
      {#each personajes as p}
        <img
          src={p.img}
          alt={p.nombre}
          class="personaje {personajeSeleccionado.id === p.id ? 'activo' : ''}"
          on:click={() => seleccionarPersonaje(p)}
        />
      {/each}
    </div>

    <div class="game-footer">
      <button class="btn start" on:click={() => iniciarJuego("CPU")}>
        ▶ Iniciar pelea
      </button>

      <a href="/" class="btn salir">
        ⬅ Volver al menú
      </a>

      <button class="btn start" on:click={() => iniciarJuego("PVP")}>
        👥 1 vs 1
      </button>
    </div>

  </div>
</div>

<style>
.game-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, rgba(85, 85, 85, 0.014), #22222200);
}

.game-frame {
  width: 900px;
  background: rgba(20,20,20,0.2);
  border-radius: 22px;
  padding: 20px;
  box-shadow: 0 0 40px rgba(0,0,0,0.75);
  border: 2px solid rgba(255,255,255,0.08);
}

.game-header {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}

.juego-area {
  height: 460px;
  background: #000;
  border-radius: 14px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  background: #222;
  border-radius: 12px;
}

.selector-personajes {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 12px 0 18px;
  padding: 10px;
  background: rgba(0,0,0,0.35);
  border-radius: 14px;
}

.personaje {
  width: 70px;
  height: 90px;
  object-fit: contain;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s, border 0.2s, box-shadow 0.2s;
}

.personaje:hover {
  transform: scale(1.1);
  border-color: #f107a3;
}

.personaje.activo {
  border-color: #7b2ff7;
  box-shadow: 0 0 12px rgba(123,47,247,0.85);
  transform: scale(1.12);
}

.game-footer {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.btn.start {
  background: linear-gradient(135deg, #7b2ff7, #f107a3);
  color: white;
  border: none;
  padding: 14px 26px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.btn.start:hover {
  transform: scale(1.08);
}

.btn.salir {
  background: #555;
  color: #eee;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  opacity: 0.85;
}
</style>
