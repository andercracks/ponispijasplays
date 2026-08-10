<script>
  const simbolos = ["🔔", "🐷", "💪🏿", "🫃🏿", "😈", "🎠"];

  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matches = 0;

  function initGame() {
    matches = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    cards = [...simbolos, ...simbolos]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }));
  }

  function flipCard(card) {
    if (lockBoard || card.flipped || card.matched) return;

    card.flipped = true;
    cards = cards;

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    checkMatch();
  }

  function checkMatch() {
    lockBoard = true;

    if (firstCard.value === secondCard.value) {
      firstCard.matched = true;
      secondCard.matched = true;
      matches++;
      cards = cards; 

      resetTurn();
    } else {
      setTimeout(() => {
        firstCard.flipped = false;
        secondCard.flipped = false;
        cards = cards;
        resetTurn();
      }, 800);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  initGame();
</script>

<h1> Memoriza al Yupi</h1>
<p>Aciertos: {matches} / {simbolos.length}</p>

<div class="board">
  {#each cards as card}
    <div class="card" on:click={() => flipCard(card)}>
      {#if card.flipped || card.matched}
        <span class="emoji">{card.value}</span>
      {:else}
        <span class="question">?</span>
      {/if}
    </div>
  {/each}
</div>

<div class="buttons">
  <button on:click={initGame}>Reiniciar</button>
  <button on:click={() => window.location.href = "/"}>
    Salir al menú
  </button>
</div>

<style>
  h1, p {
    text-align: center;
    color: white;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(4, 80px);
    gap: 15px;
    justify-content: center;
    margin: 30px auto;
  }

  .card {
    width: 80px;
    height: 100px;
    background: rgba(255,255,255,0.85);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    cursor: pointer;
    user-select: none;
  }

  .emoji {
    animation: pop 0.2s ease;
  }

  @keyframes pop {
    from { transform: scale(0.6); }
    to { transform: scale(1); }
  }

  .buttons {
    text-align: center;
    margin-top: 20px;
  }

  button {
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #555;
    color: white;
  }
</style>
