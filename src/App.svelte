<script lang="ts">
  import FortuneWheel from './lib/FortuneWheel.svelte';
  import { participants } from './stores/participants';

  let isSpinning = false;

  function handleSpin() {
    if (!isSpinning && $participants.length > 0) {
      isSpinning = true;
    }
  }

  function handleSpinComplete() {
    isSpinning = false;
  }
</script>

<main>
  <h1>Fortune Wheel</h1>
  
  <div class="wheel-container">
    <FortuneWheel
      {isSpinning}
      on:spinComplete={handleSpinComplete}
    />
  </div>

  <button
    on:click={handleSpin}
    disabled={isSpinning || $participants.length === 0}
  >
    {#if isSpinning}
      Spinning...
    {:else if $participants.length === 0}
      No more participants
    {:else}
      Spin the Wheel!
    {/if}
  </button>

  {#if $participants.length === 0}
    <p class="reset-message">Refresh the page to reset the wheel</p>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    min-height: 100vh;
    background: #f5f5f5;
  }

  h1 {
    color: #333;
    margin-bottom: 2rem;
  }

  .wheel-container {
    margin-bottom: 2rem;
  }

  button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover:not(:disabled) {
    background: #45a049;
  }

  button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  .reset-message {
    margin-top: 1rem;
    color: #666;
  }
</style>