<script>
  import { onMount } from "svelte";

  let nivel = 1;
  let vidas = 3;

  let player = {
    x: 50,
    y: 380,
    width: 40,
    height: 40,
    velocityY: 0,
    isJumping: false
  };

  let gravity = 0.6;
  let keys = {};

  let obstaculos = [
    { x: 300, y: 420, width: 60, height: 40 },
    { x: 500, y: 420, width: 60, height: 40 }
  ];

  let meta = { x: 730, y: 380, width: 50, height: 50 };

  function resetPlayer() {
    player.x = 50;
    player.y = 380;
    player.velocityY = 0;
  }

  function cambiarNivel() {
    nivel++;

    obstaculos = [
      { x: 250, y: 420, width: 60, height: 40 },
      { x: 400, y: 420, width: 60, height: 40 },
      { x: 550, y: 420, width: 60, height: 40 }
    ];

    resetPlayer();
  }

  function perderVida() {
    vidas--;
    if (vidas <= 0) {
      nivel = 1;
      vidas = 3;
    }
    resetPlayer();
  }

  function colision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function gameLoop() {
    
    if (keys["ArrowRight"]) player.x += 5;
    if (keys["ArrowLeft"]) player.x -= 5;

    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > 800)
      player.x = 800 - player.width;

    
    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y >= 420) {
      player.y = 420;
      player.velocityY = 0;
      player.isJumping = false;
    }

    
    for (let obs of obstaculos) {
      if (colision(player, obs)) {
        perderVida();
      }
    }

    if (colision(player, meta)) {
      cambiarNivel();
    }

    requestAnimationFrame(gameLoop);
  }

  function handleKeyDown(e) {
    keys[e.key] = true;

    if (e.key === " " && !player.isJumping) {
      player.velocityY = -14;
      player.isJumping = true;
    }
  }

  function handleKeyUp(e) {
    keys[e.key] = false;
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    gameLoop();
  });
</script>

<div class="game-wrapper">
  <div class="game-frame">

    <div class="game-header">
      Secreto del Laboratorio de la Maldición
    </div>

    <div class="game">

        {#each obstaculos as obs}
        <div
            class="obstaculo"
            style="
            left: {obs.x}px;
            top: {obs.y}px;
            width: {obs.width}px;
            height: {obs.height}px;
            "
        ></div>
        {/each}

        <div
        class="meta"
        style="
            left: {meta.x}px;
            top: {meta.y}px;
            width: {meta.width}px;
            height: {meta.height}px;
        "
        ></div>

      <div class="ui">
        <p>Nivel: {nivel}</p>
        <p>Vidas: {vidas}</p>
      </div>

      <div
        class="player"
        style="
          left: {player.x}px;
          top: {player.y}px;
          width: {player.width}px;
          height: {player.height}px;
        "
      ></div>

      <canvas id="gameCanvas" width="800" height="460"></canvas>

    </div>

    <div class="game-footer">
      <button class="btn start">
        ▶ Iniciar historia
      </button>

      <a href="/" class="btn salir">
        ⬅ Volver al menú
      </a>

      <button class="btn start">
        📜 Menú de niveles
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
    background: radial-gradient(circle at center, rgba(233, 231, 231, 0), #11111105);
  }

  .game-frame {
    width: 900px;
    background: rgba(20,20,20,0.6);
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

  .game {
    width: 800px;
    height: 460px;
    background: #000;
    border-radius: 14px;
    margin: 0 auto 12px auto;
    position: relative;   
    overflow: hidden;     
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background: #f5f1f10c;
    border-radius: 14px;
  }

  .player {
    position: absolute;
    background: cyan;
    border-radius: 6px;
    z-index: 2;
  }

  .ui {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    z-index: 3;
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
    .obstaculo {
        position: absolute;
        background: red;
        border-radius: 4px;
    }

    .meta {
        position: absolute;
        background: lime;
        border-radius: 8px;
    }
</style>
