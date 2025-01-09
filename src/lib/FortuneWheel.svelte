<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { participants } from '../stores/participants';

  const dispatch = createEventDispatcher();

  export let isSpinning: boolean = false;
  let previousSpinState = false;
  let selectedParticipants: string[] = [];
  
  let slotContainer: HTMLDivElement;
  let currentPosition = 0;
  let selectedSegment = -1;
  const itemHeight = 50;
  
  $: displayList = createDisplayList($participants);

  function createDisplayList(items: string[]) {
    if (!items.length) return [];
    const repeats = 5; // Количество повторений списка
    let result: string[] = [];
    for (let i = 0; i < repeats; i++) {
      result = result.concat([...items]);
    }
    return result;
  }

  function getRandomPosition(): number {
    if (!$participants.length) return 0;
    
    const MIN_SPINS = 2;
    const MAX_EXTRA_SPINS = 4;
    const extraSpins = Math.floor(Math.random() * MAX_EXTRA_SPINS);
    const randomIndex = Math.floor(Math.random() * $participants.length);
    const centerOffset = Math.floor(displayList.length / 2);
    
    // Вычисляем позицию так, чтобы выбранный элемент оказался в центре
    const basePosition = -(centerOffset + randomIndex) * itemHeight;
    const totalSpins = (MIN_SPINS + extraSpins) * ($participants.length);
    const spinOffset = totalSpins * itemHeight;
    
    return basePosition - spinOffset;
  }

  function animate(targetPosition: number, startTime: number, duration: number) {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    
    if (elapsed < duration) {
      const progress = elapsed / duration;
      const eased = cubicBezier(0.32, 0.94, 0.60, 1, progress);
      currentPosition = interpolate(0, targetPosition, eased);
      requestAnimationFrame(() => animate(targetPosition, startTime, duration));
    } else {
      currentPosition = targetPosition;
      finishSpin();
    }
  }

  function interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number): number {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    const tCubed = t * t * t;
    const tSquared = t * t;
    
    return ay * tCubed + by * tSquared + cy * t;
  }

  function finishSpin() {
    if (!$participants.length) return;

    const itemsPerRevolution = $participants.length;
    const centerPosition = -Math.round(currentPosition / itemHeight) * itemHeight;
    const centerIndex = Math.abs(Math.round(currentPosition / itemHeight)) % itemsPerRevolution;
    
    selectedSegment = centerIndex % $participants.length;
    const selectedParticipant = $participants[selectedSegment];
    
    if (selectedParticipant) {
      selectedParticipants = [...selectedParticipants, selectedParticipant];
      
      participants.update(current => 
        current.filter((_, index) => index !== selectedSegment)
      );
    }

    dispatch('spinComplete');
    isSpinning = false;
    previousSpinState = false;
    currentPosition = 0; // Сброс позиции
  }

  $: if (isSpinning !== previousSpinState && isSpinning && $participants.length > 0) {
    previousSpinState = isSpinning;
    const targetPosition = getRandomPosition();
    animate(targetPosition, Date.now(), 5000);
  }

  onMount(() => {
    currentPosition = 0;
    isSpinning = false;
    previousSpinState = false;
    selectedParticipants = [];
  });
</script>

<div class="fortune-wheel-container">
  <div class="slot-machine">
    <div class="slot-frame">
      <div class="highlight-overlay"></div>
      <div 
        class="slot-wheel"
        class:spinning={isSpinning}
        bind:this={slotContainer}
        style="transform: translateY({currentPosition}px)"
      >
        {#each displayList as participant}
          <div class="slot-item">
            <span class="participant-name">{participant}</span>
          </div>
        {/each}
      </div>
      <div class="selection-indicator left">▶</div>
      <div class="selection-indicator right">◀</div>
    </div>
  </div>

  {#if selectedParticipants.length > 0}
    <div class="selected-participants">
      <h3>Выбранные участники:</h3>
      <ol>
        {#each selectedParticipants as participant}
          <li>{participant}</li>
        {/each}
      </ol>
    </div>
  {/if}
</div>

<style>
  .fortune-wheel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .slot-machine {
    background: #2c3e50;
    border: 10px solid #34495e;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 
      0 0 20px rgba(0, 0, 0, 0.3),
      inset 0 0 50px rgba(0, 0, 0, 0.5);
  }

  .slot-frame {
    position: relative;
    width: 300px;
    height: 50px;
    background: #fff;
    border: 2px solid #bdc3c7;
    border-radius: 5px;
    overflow: hidden;
  }

  .highlight-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 20%,
      rgba(255, 255, 255, 0) 80%,
      rgba(255, 255, 255, 0.2) 100%
    );
    pointer-events: none;
    z-index: 2;
  }

  .slot-wheel {
    position: absolute;
    width: 100%;
    will-change: transform;
  }

  .spinning {
    transition: transform 5s cubic-bezier(0.32, 0.94, 0.60, 1);
  }

  .slot-item {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40px;
    box-sizing: border-box;
    width: 100%;
    background: #fff;
  }

  .slot-item:nth-child(odd) {
    background: #ecf0f1;
  }

  .participant-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: 100%;
  }

  .selection-indicator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #e74c3c;
    font-size: 24px;
    z-index: 3;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  }

  .selection-indicator.left {
    left: 5px;
  }

  .selection-indicator.right {
    right: 5px;
  }

  .selected-participants {
    background: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 300px;
    margin-top: 1rem;
  }

  .selected-participants h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .selected-participants ol {
    margin: 0;
    padding-left: 1.5rem;
  }

  .selected-participants li {
    margin: 0.5rem 0;
    color: #666;
  }

  @keyframes slot-glow {
    0%, 100% { 
      box-shadow: 
        0 0 20px rgba(0, 0, 0, 0.3),
        inset 0 0 50px rgba(0, 0, 0, 0.5);
    }
    50% { 
      box-shadow: 
        0 0 30px rgba(231, 76, 60, 0.5),
        inset 0 0 60px rgba(231, 76, 60, 0.3);
    }
  }

  .spinning ~ .slot-machine {
    animation: slot-glow 0.5s ease-in-out infinite;
  }

  @media (max-width: 600px) {
    .slot-frame {
      width: 250px;
    }

    .participant-name {
      font-size: 1rem;
    }
  }
</style>