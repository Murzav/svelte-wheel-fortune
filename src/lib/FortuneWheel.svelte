<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { participants } from '../stores/participants';

  const dispatch = createEventDispatcher();

  export let isSpinning: boolean = false;

  let wheelElement: HTMLDivElement;
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

  // Calculate positioning for each segment's text
  function getTextStyle(index: number): string {
    const angle = index * segmentAngle;
    const rotation = angle + segmentAngle / 2;
    return `transform: rotate(${rotation}deg) translateY(-160px) rotate(-${rotation}deg);`;
  }
</script>

<div 
  class="wheel-wrapper"
  class:spinning={isSpinning}
>
  <div 
    class="wheel" 
    bind:this={wheelElement}
    style="transform: rotate({currentRotation}deg)"
  >
    {#each $participants as participant, i}
      <div 
        class="segment" 
        style="transform: rotate({i * segmentAngle}deg); 
               background: {i % 2 === 0 ? '#4CAF50' : '#45a049'};"
      >
        <span class="segment-text" style={getTextStyle(i)}>{participant}</span>
      </div>
    {/each}
  </div>
  <div class="pointer"></div>
</div>

<style>
  .wheel-wrapper {
    position: relative;
    width: 400px;
    height: 400px;
    margin: 20px;
  }

  .wheel {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 10px solid #333;
    transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  }

  .segment {
    position: absolute;
    width: 50%;
    height: 50%;
    transform-origin: 100% 100%;
    left: 50%;
    top: 0;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .segment::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 200px 200px 0 0;
    border-color: inherit;
    transform-origin: 0 100%;
  }

  .segment-text {
    position: absolute;
    left: 50%;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    transform-origin: 0 0;
  }

  .pointer {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    background: #333;
    clip-path: polygon(50% 100%, 0 0, 100% 0);
  }
</style>