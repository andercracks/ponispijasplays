<script>
  let { abierto = $bindable(false), mensaje = "", respuesta = "", onClose = () => {} } = $props();
  let respondo = $state("");
  let error = $state([]);

  function enviarRespuesta() {
    error = [];

    if (respondo.trim() === "") {
      error.push("di algo añañaoooo cagon.");
      return;
    }else{
      respuesta = "la tuya por si acaso ajajajajaj mancaso 🦣"
    }


    respondo = "";
  }

  function cerrar() {
    onClose();
    abierto = false;
  }
</script>

{#if abierto}
  <div class="overlay" role="dialog" aria-modal="true" on:click={cerrar}>
    <div class="modal" on:click|stopPropagation>
      <h2>💌 Notificación</h2>
      <p>{mensaje}</p>

      {#if error.length > 0}
        <ul>
          {#each error as e}
            <li style="color:red;">{e}</li>
          {/each}
        </ul>
      {/if}

      <input placeholder="a ver dime algo" bind:value={respondo} />

      <button type="button" on:click={enviarRespuesta}>
        mira lo que te digo JAA
      </button>

      <button 
        on:click={() => window.location.href = "/"}
        style="
          padding: 10px 20px;
          background: purple;
          color: white;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 15px;
        "
      >
        Juegos 🎮
      </button>


      <button type="button" on:click={cerrar}>Cerrar</button>

      {#if respuesta}
        <p style="margin-top:1rem; color:#e91e63;">{respuesta}</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
  }

  button {
    margin: 0.5rem;
    background-color: hotpink;
    border: none;
    color: white;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
  }
</style>
