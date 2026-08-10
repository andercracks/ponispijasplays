<script>
  import Modal from "./Modal.svelte";
  import Saludo from "./Saludo.svelte";
  import { contadorFormularios } from "../stores/contadorStore.js";
  import { onMount } from "svelte";

  let nombre = $state("");
  let correo = $state("");
  let errores = $state([]);
  let mensaje = $state("");
  let mostrarModal = $state(false);
  let mostrarSaludo = $state(false);
  let musica1;

  function enviarFormulario() {
    errores = [];

    if (nombre.trim() === "") {
      errores.push("El nombre es obligatorio mierda.");
    }

    if (correo.trim() === "" || !correo.includes("@")|| (!correo.includes("gmail") && !correo.includes("hotmail")) || !correo.includes(".com")) {
      errores.push("El correo no es válido.");
    }

    if (errores.length > 0) return;

    mensaje = `Formulario enviado correctamente 🎉\nNombre: ${nombre}\nCorreo: ${correo}`;
    mostrarModal = true;

    contadorFormularios.update(n => n + 1);

    nombre = "";
    correo = "";
  }

  function cerrarModal() {
    mostrarModal = false;
  }
  function abrirSaludo() {
    mostrarSaludo = true;
  }

  function cerrarSaludo() {
    mostrarSaludo = false;
  }

  onMount(() => {
    musica1 = new Audio("/musica1.mp3");
    musica1.loop = true;
    musica1.volume = 0.4;

    const iniciarMusica = () => {
      musica1.play().catch(() => {});
      window.removeEventListener("click", iniciarMusica);
      window.removeEventListener("keydown", iniciarMusica);
    };

    window.addEventListener("click", iniciarMusica);
    window.addEventListener("keydown", iniciarMusica);
  });

</script>

<div class="formulario">
  <h2>Formulario de animan studios is live</h2>

  {#if errores.length > 0}
    <ul class="errores">
      {#each errores as error}
        <li>{error}</li>
      {/each}
    </ul>
  {/if}

  <input placeholder="Tu nombre" bind:value={nombre} />
  <input placeholder="Tu correo" bind:value={correo} />
  <button type="button" onclick={enviarFormulario}>Enviar</button>
  <button type="button" onclick={abrirSaludo}>abrirSaludo</button>

  <p class="contador">
    Formularios enviados: {$contadorFormularios}
  </p>

  <Modal bind:abierto={mostrarModal} {mensaje} onClose={cerrarModal} />
  {#if mostrarSaludo}
    <Saludo nombre="Karin" />
    <button onclick={cerrarSaludo}>Cerrar saludo</button>
  {/if}
</div>

<style>
  .formulario {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    max-width: 400px;
    margin: 2rem auto;
  }

  input {
    display: block;
    margin: 10px auto;
    padding: 10px;
    width: 90%;
    border: 1px solid #cccccc;
    border-radius: 5px;
  }

  button {
    background-color: #007bff;
    color: rgb(255, 255, 255);
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .contador {
    margin-top: 1rem;
    color: #444;
  }

  .errores {
    color: red;
    list-style-type: none;
    padding: 0;
    margin-bottom: 1rem;
  }
</style>
