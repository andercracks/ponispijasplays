<script>

  const adivinanzas = [
    {
      pregunta: "¿Quién es el esposo de jh?",
      imagen: "/temuliano.png",
      opciones: ["murillo", "temuliano", "son murillo", "pepa hot"],
      respuesta: "murillo",
    },
    {
      imagen: "/temuliano.png",
      pregunta: "¿Quién es el nuevo meme de los memes?",
      opciones: ["jh", "pepa hot", "murillo", "pennywise"],
      respuesta: "pepa hot",
    },
    {
      imagen: "/temuliano.png",
      pregunta: "¿Quién compró la finca de la maldición?",
      opciones: ["temuliano", "jh", "murillo", "nadie"],
      respuesta: "jh",
    },
    {
      
      pregunta: "¿Quién se detonó a pennywise?",
      imagen: "/temuliano.png",
      opciones: ["murillo", "jh", "pepa hot", "nadie"],
      respuesta: "murillo",
    },
  ];

  let started = false;
  let i = 0;
  let msg = "";
  let puntos = 0;
  let terminado = false;
  let seleccion = "";

  function iniciarJuego() {
    started = true;
    i = 0;
    msg = "";
    puntos = 0;
    terminado = false;
    seleccion = "";
  }

  function verificar(opcion) {
    if (seleccion) return; 

    seleccion = opcion;

    if (opcion === adivinanzas[i].respuesta) {
      puntos++;
      msg = "✅ ¡Correcto!";
    } else {
      msg = "❌ Incorrecto";
    }

    setTimeout(() => {
      msg = "";
      seleccion = "";

      if (i < adivinanzas.length - 1) {
        i++;
      } else {
        terminado = true;
      }
    }, 1000);
  }
</script>

<div style="text-align:center; margin-top:20px;">
  {#if !started}
    <button
      on:click={iniciarJuego}
      style="padding:10px 20px; background:purple; color:white; border:none; border-radius:8px; cursor:pointer;"
    >
      Iniciar Juego
    </button>

    <button
      on:click={() => window.location.href = "/"}
      style="padding:10px 20px; background:#555; color:white; border:none; border-radius:8px; cursor:pointer; margin-left:10px;"
    >
      Salir al menú
    </button>

  {:else if terminado}
    <h2>🎉 ¡Ganaste!</h2>
    <p>Puntaje final: <b>{puntos}</b></p>

    <button
      on:click={iniciarJuego}
      style="padding:10px 20px; background:purple; color:white; border:none; border-radius:8px; cursor:pointer;"
    >
      Jugar otra vez
    </button>

    <button
      on:click={() => window.location.href = "/"}
      style="padding:10px 20px; background:#555; color:white; border:none; border-radius:8px; cursor:pointer; margin-left:10px;"
    >
      Salir al menú
    </button>

  {:else}
    <div style="margin-top:10px;">
      <h2 style="margin-bottom:10px;">🧠 Adivinanza</h2>
      <p style="font-size:18px;">{adivinanzas[i].pregunta}</p>
      <img 
        src={adivinanzas[i].imagen} 
        alt="imagen pregunta"
        style="width:220px; margin-top:15px; border-radius:12px;"
      />

      <div class="opciones">
        {#each adivinanzas[i].opciones as opcion}
          <div
            class="opcion
              {seleccion && opcion === adivinanzas[i].respuesta ? 'correcta' : ''}
              {seleccion && opcion !== adivinanzas[i].respuesta && opcion === seleccion ? 'incorrecta' : ''}
            "
            on:click={() => verificar(opcion)}
          >
            {opcion}
          </div>
        {/each}
      </div>

      <p style="margin-top:12px;">{msg}</p>
      <p><b>Puntos:</b> {puntos} | <b>Ronda:</b> {i + 1}/{adivinanzas.length}</p>
    </div>
  {/if}
</div>

<style>
  .opciones {
    display: grid;
    grid-template-columns: repeat(2, 260px);
    justify-content: center;
    gap: 14px;
    margin-top: 20px;
  }

  .opcion {
    padding: 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.15);
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
  }

  .opcion:hover {
    background: rgba(255,255,255,0.25);
    transform: scale(1.03);
  }

  .opcion.correcta {
    background: #2ecc71;
    color: black;
    font-weight: bold;
  }

  .opcion.incorrecta {
    background: #e74c3c;
    color: white;
  }
</style>
