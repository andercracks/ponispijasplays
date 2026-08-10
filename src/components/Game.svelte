<script>
  import { onMount } from "svelte";
  let score = 0;
  let x = 100;
  let y = 100;

  let tiempo = 30;
  let jugando = false;
  let mensaje = "";
  let intervalo;
  let musiquita;

  const sonidoGanar = new Audio("/murillo.m4a");
  const clickAtrapar = new Audio("/clickatrapar.mp3");
  const sonidoFinalizado = new Audio("/victoria.mp3");


  function mover() {
    x = Math.random() * 340;
    y = Math.random() * 340;
  }

  function atrapar() {
    if (!jugando) return;
    clickAtrapar.currentTime = 0;
    clickAtrapar.play();
    score++;
    mover();
    RecordPuntos();
  }

  function iniciarJuego() {
    
    score = 0;
    tiempo = 30;
    jugando = true;
    mensaje = "";
    mover();

    clearInterval(intervalo);

    intervalo = setInterval(() => {
      tiempo--;
      if (tiempo <= 0) finalizarJuego();
    }, 1000);
    
  }

  function RecordPuntos(){
      if (score == 50){
          mensaje = `🎉 ¡GANASTE! el puntaje es: ${score}`;
          jugando = false;
          clearInterval(intervalo);

          sonidoGanar.play();
      }

  }

  function finalizarJuego() {
    jugando = false;
    mensaje = `Juego terminado. Tu puntaje fue: ${score}`;
    clearInterval(intervalo);
    sonidoFinalizado.currentTime = 0;
    sonidoFinalizado.play();
  }
  
  onMount(() => {
    musica = new Audio("/musica1.mp3");
    musica.loop = true;
    musica.volume = 0.4;

    const iniciarMusica = () => {
      musica.play().catch(() => {});
      window.removeEventListener("click", iniciarMusica);
      window.removeEventListener("keydown", iniciarMusica);
    };

    window.addEventListener("click", iniciarMusica);
    window.addEventListener("keydown", iniciarMusica);
  });

</script>

<h1 style="text-align:center;"> Atrapa al temuliano 😈❤️👋🦣</h1>

<p style="text-align:center; font-size:18px;">
  Tiempo: {tiempo}s | Puntos: {score}
</p>

<div style="
  position: relative;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.219);
  margin: auto;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #ccc;
">

  {#if jugando}
    <img
        src="/yupiliano.png"
        on:click={atrapar}
        alt="cuadrado"
        style="
        position: absolute;
        left: {x}px;
        top: {y}px;
        width: 60px;
        height: 60px;
        cursor: pointer;
        "
    />

  {/if}

</div>


<div style="text-align:center; margin-top:20px;">
  <button 
    on:click={iniciarJuego}
    style="padding:10px 20px; background:purple; color:white;
      border:none; border-radius:8px; cursor:pointer;"
  >
    Iniciar Juego
  </button>

  <button 
    on:click={() => window.location.href = "/"}
    style="padding:10px 20px; background:#555; color:white;
      border:none; border-radius:8px; cursor:pointer; margin-left:10px;"
  >
    Salir al menu
  </button>
</div>

{#if mensaje}
  <p style="text-align:center; font-size:20px; margin-top:15px;">{mensaje}</p>
{/if}
