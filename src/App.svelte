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
  
  <div class="content">
    <FortuneWheel
      {isSpinning}
      on:spinComplete={handleSpinComplete}
    />

    <button
      on:click={handleSpin}
      disabled={isSpinning || $participants.length === 0}
      class="spin-button"
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
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background: #f5f5f5;
  }

  h1 {
    color: #333;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .spin-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    min-width: 200px;
  }

  .spin-button:hover:not(:disabled) {
    background: #45a049;
  }

  .spin-button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  .reset-message {
    color: #666;
    text-align: center;
  }
</style>