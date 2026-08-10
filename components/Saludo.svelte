<script>
  import { onMount } from "svelte";

  let { abiertaso = $bindable(false), location = $bindable(), cerradito = () => {} } = $props();
  
  let count = $state(0);
  
  let name = $state('matias');

  const clicktap = new Audio("/clickatrapar.mp3");

  onMount(() => {
    location = window.location.href;
  })

  function incrementar() {
    count++;
    clicktap.currentTime = 0;
    clicktap.play();
  }

  

</script>

<input bind:value={name} />
  <h1>Hola {name}, saludos de parte de animan studios</h1>

<div class="contenedor">
  <h2>animan</h2>
  <h2>CONTADOR: {count}</h2>
  <button onclick={incrementar}>SUMAR +1</button>
</div>

<style>
  .contenedor {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  button {
    padding: 8px 16px;
    border: none;
    background-color: #9451eb;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background-color: #e055b8;
  }
</style>
