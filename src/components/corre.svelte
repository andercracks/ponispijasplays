<script>
  let iniciado = false;
  let gameOver = false;
  let ganar = false;

  const MAP_WIDTH = 5000;
  const VIEW_WIDTH = 1020;
  const META = 4800;

  let worldX = 0;

  let playerX = 100;
  let playerY = 0;
  let velY = 0;
  let enAire = false;

  let left = false;
  let right = false;

  let murilloWorldX = -250;
  const sonidoMurilloAtra = new Audio("/MuriAu.mp3");

  const obstaculos = [
    { x: 500, w: 40, h: 40 },
    { x: 850, w: 40, h: 60 },
    { x: 1200, w: 40, h: 40 },
    { x: 1600, w: 40, h: 50 },
    { x: 2100, w: 40, h: 40 },
    { x: 2600, w: 40, h: 60 },
    { x: 3200, w: 40, h: 40 },
    { x: 3800, w: 40, h: 50 }
  ];

  const GRAVEDAD = 0.6;
  const SALTO = 14;
  const SPEED = 3;

  function iniciarJuego() {
    iniciado = true;
    gameOver = false;
    ganar = false;

    worldX = 0;
    playerX = 100;
    playerY = 0;
    velY = 0;
    enAire = false;

    murilloWorldX = -250;

    loop();
  }

  function saltar() {
    if (!enAire && iniciado && !gameOver) {
      velY = SALTO;
      enAire = true;
    }
  }

  function loop() {
    if (gameOver || ganar) return;

    if (right) {
      if (playerX < VIEW_WIDTH / 2) {
        playerX += SPEED;
      } else if (worldX < MAP_WIDTH - VIEW_WIDTH) {
        worldX += SPEED;
      }
    }

    if (left) {
      if (playerX > 100) {
        playerX -= SPEED;
      } else if (worldX > 0) {
        worldX -= SPEED;
      }
    }

    velY -= GRAVEDAD;
    playerY += velY;

    if (playerY <= 0) {
      playerY = 0;
      velY = 0;
      enAire = false;
    }

    murilloWorldX += right ? 1.2 : 2;

    obstaculos.forEach(o => {
      const ox = o.x - worldX;
      if (
        playerX < ox + o.w &&
        playerX + 44 > ox &&
        playerY < o.h &&
        playerY + 44 > 0
      ) {
        gameOver = true;
        sonidoMurilloAtra.currentTime = 0;
        sonidoMurilloAtra.play();
      }
    });

    if (murilloWorldX >= worldX + playerX - 20) {
      gameOver = true;
      sonidoMurilloAtra.currentTime = 0;
      sonidoMurilloAtra.play();
    }

    if (worldX >= MAP_WIDTH - VIEW_WIDTH - 5) {
        ganar = true;
    }


    requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", e => {
    if (e.code === "Space") {
      e.preventDefault();
      saltar();
    }
    if (e.code === "ArrowRight" || e.code === "KeyD") right = true;
    if (e.code === "ArrowLeft" || e.code === "KeyA") left = true;
  });

  window.addEventListener("keyup", e => {
    if (e.code === "ArrowRight" || e.code === "KeyD") right = false;
    if (e.code === "ArrowLeft" || e.code === "KeyA") left = false;
  });
</script>

<div class="pantalla-juego">

  <div class="marco-juego">

    {#if iniciado}
      <div class="juego">

        <div
          class="jugador"
          style="left:{playerX}px; bottom:{playerY}px"
        ></div>

        <div
          class="murillo"
          style="left:{murilloWorldX - worldX}px"
        ></div>

        {#each obstaculos as o}
          <div
            class="obstaculo"
            style="left:{o.x - worldX}px; width:{o.w}px; height:{o.h}px"
          ></div>
        {/each}

        <div class="hud">
          {Math.floor(worldX + playerX)} / {META}
        </div>

        {#if gameOver}
          <div class="mensaje perder">💀 Murillo te atrapó</div>
        {/if}

        {#if ganar}
          <div class="mensaje ganar">🎉 Escapaste de Murillo</div>
        {/if}

      </div>
    {:else}
      <p class="texto-inicio">Presiona iniciar para jugar</p>
    {/if}

  </div>

  <div class="acciones">
    <button class="btn iniciar" on:click={iniciarJuego}>
      ▶ Iniciar juego
    </button>

    <a href="/" class="btn salir">
      ⬅ Volver al menú
    </a>
  </div>
</div>

<style>
.pantalla-juego {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.marco-juego {
  width: 1020px;
  height: 460px;
  background: rgba(0, 0, 0, 0.45);
  border: 2px solid rgba(255,255,255,0.8);
  border-radius: 18px;
  backdrop-filter: blur(6px);
  overflow: hidden;
  position: relative;
}

.juego {
  position: relative;
  width: 100%;
  height: 100%;
}

.jugador {
  position: absolute;
  width: 44px;
  height: 44px;
  background: url('/yupiloverEs.png') no-repeat center / cover;
  bottom: 0;
}

.murillo {
  position: absolute;
  width: 50px;
  height: 50px;
  background: url('/MurilloEs.png') no-repeat center / cover;
  bottom: 0;
}

.obstaculo {
  position: absolute;
  width: 50px;
  height: 50px;
  bottom: 0;
  background: url('/Obstaculo.png') no-repeat center / cover;
  border-radius: 6px;
}

.hud {
  position: absolute;
  top: 10px;
  left: 12px;
  color: white;
  font-size: 14px;
  z-index: 5;
}

.mensaje {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: rgba(0,0,0,0.65);
  z-index: 10;
}

.ganar { color: #4caf50; }
.perder { color: #ff5252; }

.texto-inicio {
  color: white;
  font-size: 16px;
  opacity: 0.85;
}

.acciones {
  display: flex;
  gap: 14px;
}

.btn {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn.iniciar {
  background: linear-gradient(135deg, #7b2ff7, #f107a3);
  color: white;
}

.btn.salir {
  background: #555;
  color: #eee;
  text-decoration: none;
}
</style>
