<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { participants } from '../stores/participants';

  const dispatch = createEventDispatcher();

  export let isSpinning: boolean = false;

  let currentRotation = 0;
  let selectedSegment = -1;

  $: segmentAngle = 360 / $participants.length;

  function getRandomDegrees(): number {
    const MIN_SPINS = 5;
    const randomIndex = Math.floor(Math.random() * $participants.length);
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    const fullSpins = MIN_SPINS * 360;
    return fullSpins + targetAngle;
  }

  $: if (isSpinning) {
    const targetRotation = currentRotation + getRandomDegrees();
    currentRotation = targetRotation;

    // Calculate selected segment after spin
    setTimeout(() => {
      const normalizedRotation = targetRotation % 360;
      const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle);
      selectedSegment = selectedIndex % $participants.length;
      
      // Remove selected participant
      participants.update(current => 
        current.filter((_, index) => index !== selectedSegment)
      );

      dispatch('spinComplete');
    }, 5000); // Match this with CSS animation duration
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
          background: {i % 2 === 0 ? '#4CAF50' : '#45a049'};
        "
      >
        <div class="text" style="transform: rotate({segmentAngle / 2}deg)">
          {participant}
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
    background: #333;
    transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    transform-origin: center center;
    border: 8px solid #222;
  }

  .segment {
    position: absolute;
    width: 50%;
    height: 50%;
    transform-origin: bottom right;
    left: 0;
    top: 0;
  }

  .segment::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 200px 200px 0 0;
    border-color: inherit;
  }

  .text {
    position: absolute;
    left: 35px;
    top: 75px;
    transform-origin: 0 0;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
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