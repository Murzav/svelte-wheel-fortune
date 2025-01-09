<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { participants } from '../stores/participants';

  const dispatch = createEventDispatcher();

  export let isSpinning: boolean = false;
  let selectedParticipant: string | null = null;
  let currentRotation = 0;

  $: segmentAngle = 360 / $participants.length;

  function spin() {
    if (isSpinning) {
      const randomIndex = Math.floor(Math.random() * $participants.length);
      selectedParticipant = $participants[randomIndex];
      
      const targetAngle = -(randomIndex * segmentAngle);
      const fullSpins = 5 * 360; // 5 полных оборотов
      const newRotation = fullSpins + targetAngle;
      
      currentRotation = currentRotation % 360; // Нормализуем текущий угол
      currentRotation += newRotation; // Добавляем новое вращение

      setTimeout(() => {
        // Удаляем выбранного участника
        participants.update(current => 
          current.filter(p => p !== selectedParticipant)
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
        style="
          transform: rotate({i * segmentAngle}deg);
          background: {i % 2 === 0 ? '#333' : '#222'};
        "
      >
        <div class="text">
          {participant}
        </div>
      </div>
    {/each}
  </div>
  <div class="pointer" />
</div>

{#if selectedParticipant && isSpinning}
  <div class="selected-participant">
    Выбран: {selectedParticipant}
  </div>
{/if}

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
    background: #333;
  }

  .segment {
    position: absolute;
    width: 100%;
    height: 100%;
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
    transform-origin: center;
  }

  .text {
    position: absolute;
    left: 65%;
    top: 20%;
    transform: rotate(90deg);
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    transform-origin: left;
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

  .selected-participant {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1rem;
    border-radius: 5px;
    font-size: 1.2rem;
    z-index: 3;
  }
</style>