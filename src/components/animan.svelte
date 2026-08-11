<script>
  import "../styles/juegos.css";
  import { onMount } from "svelte";

  let busqueda = "";
  let musica;

  const juegos = [
    {
      nombre: "Atrapa al temuliano",
      ruta: "/game",
      imagen: "/temuliano.png",
      emoji: "🔔"
    },
    {
      nombre: "Escapa de murillo",
      ruta: "/corre",
      imagen: "/escapaMurillo.png",
      emoji: "😮"
    },
    {
      nombre: "yupi figth",
      ruta: "/figthY",
      imagen: "/yupiFigth.png",
      emoji: "🔔👀"
    },
    {
      nombre:"meme hot run",
      ruta:"/hotrun",
      imagen:"/memehotRun.png",
      emoji:"🐷😪",
    },
    {
      nombre:"memoriza al yupi",
      ruta:"/memoria",
      imagen:"/PadreDomingo.png",
      emoji:"😮😈",
    },
    {
      nombre:"secreto del laboratorio",
      ruta:"/laboratorySecret",
      imagen:"/yupiwise.png",
      emoji:"😮😈",
    },
  ];

  $: juegosFiltrados = juegos.filter(j =>
    j.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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

<div class="menu-juegos">

  <input
    type="text"
    placeholder="🔍 Buscar juego..."
    bind:value={busqueda}
    class="input-buscar"
  />

  {#if juegosFiltrados.length > 0}
    {#each juegosFiltrados as juego}
      <a href={juego.ruta} class="btn-juego">
        <img src={juego.imagen} alt={juego.nombre} />
        <span>{juego.nombre} {juego.emoji}</span>
      </a>
    {/each}
  {:else}
    <p class="sin-resultados">❌ No se encontraron juegos</p>
  {/if}

 // <a href="/animan" class="btn-volver">
    ⬅ ir al registro random
  </a>//
</div>
