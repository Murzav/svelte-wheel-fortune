<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { participants, selectedParticipants } from '../stores/participants';

  const dispatch = createEventDispatcher();

  export let isSpinning: boolean = false;
  let currentRotation = 0;

  $: segmentAngle = 360 / $participants.length;

  function spin() {
    if (isSpinning) {
      const randomIndex = Math.floor(Math.random() * $participants.length);
      const selected = $participants[randomIndex];
      
      const targetAngle = -(randomIndex * segmentAngle);
      const fullSpins = 5 * 360; // 5 полных оборотов
      const newRotation = fullSpins + targetAngle;
      
      currentRotation = currentRotation % 360;
      currentRotation += newRotation;

      setTimeout(() => {
        // Добавляем выбранного участника в список выбранных
        selectedParticipants.update(current => [...current, selected]);
        
        // Удаляем участника из колеса
        participants.update(current => 
          current.filter(p => p !== selected)
        );
        dispatch('spinComplete');
      }, 5000);
    }
  }

  $: if (isSpinning) {
    spin();
  }
</script>

<div class="wheel-container">
  <div 
    class="wheel"
    style="transform: rotate({currentRotation}deg)"
  >
    {#each $participants as participant, i}
      <div 
        class="segment"
        style="transform: rotate({i * segmentAngle}deg)"
      >
        <div 
          class="segment-content"
          style="background: {i % 2 === 0 ? '#333' : '#222'};"
        >
          <span class="text">{participant}</span>
        </div>
      </div>
    {/each}
  </div>
  <div class="pointer" />
</div>

<style>
  .wheel-container {
    position: relative;
    width: 400px;
    height: 400px;
    margin: 0 auto;
  }

  .wheel {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    transform-origin: center center;
    border: 8px solid #222;
    overflow: hidden;
  }

  .segment {
    position: absolute;
    width: 50%;
    height: 100%;
    transform-origin: right center;
    left: 0;
  }

  .segment-content {
    position: absolute;
    width: 200%;
    height: 50%;
    left: -100%;
    transform-origin: 100% 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .text {
    position: absolute;
    left: 150%;
    top: 35%;
    transform: rotate(90deg);
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    transform-origin: 0 0;
    white-space: nowrap;
  }

  .pointer {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    background: #333;
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    z-index: 2;
  }
</style>