<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { participants, selectedParticipants } from '../stores/participants';

  const dispatch = createEventDispatcher();

  export let isSpinning: boolean = false;
  let currentRotation = 0;
  const WHEEL_SIZE = 400;
  const CENTER = WHEEL_SIZE / 2;

  $: segmentAngle = 360 / $participants.length;

  // Функция для расчета координат текста
  function getTextCoordinates(index: number) {
    const angle = (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
    const radius = WHEEL_SIZE * 0.35; // 35% от радиуса круга
    const x = CENTER + radius * Math.cos(angle);
    const y = CENTER + radius * Math.sin(angle);
    const rotation = (index * segmentAngle + segmentAngle / 2 + 90);
    return { x, y, rotation };
  }

  function spin() {
    if (isSpinning) {
      const randomIndex = Math.floor(Math.random() * $participants.length);
      const selected = $participants[randomIndex];
      
      const targetAngle = 360 * 5 + (360 - (randomIndex * segmentAngle));
      currentRotation = 0; // Сбрасываем поворот перед новым вращением
      
      // Добавляем небольшую задержку перед вращением
      setTimeout(() => {
        currentRotation = targetAngle;
      }, 50);

      setTimeout(() => {
        selectedParticipants.update(current => [...current, selected]);
        participants.update(current => current.filter(p => p !== selected));
        dispatch('spinComplete');
      }, 5000);
    }
  }

  $: if (isSpinning) {
    spin();
  }
</script>

<div class="wheel-container">
  <svg 
    viewBox="0 0 {WHEEL_SIZE} {WHEEL_SIZE}"
    class="wheel"
    style="transform: rotate({currentRotation}deg)"
  >
    {#each $participants as participant, i}
      <g>
        <path
          d="M {CENTER} {CENTER} 
             L {CENTER} 0 
             A {CENTER} {CENTER} 0 0 1 
             {CENTER + CENTER * Math.cos((i + 1) * segmentAngle * Math.PI / 180)} 
             {CENTER + CENTER * Math.sin((i + 1) * segmentAngle * Math.PI / 180)} Z"
          fill={i % 2 === 0 ? '#333' : '#222'}
          stroke="rgba(255, 255, 255, 0.1)"
          transform="rotate({i * segmentAngle} {CENTER} {CENTER})"
        />
        {@const coords = getTextCoordinates(i)}
        <text
          x={coords.x}
          y={coords.y}
          fill="white"
          font-size="16"
          text-anchor="middle"
          transform="rotate({coords.rotation} {coords.x} {coords.y})"
        >
          {participant}
        </text>
      </g>
    {/each}
  </svg>
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
    width: 100%;
    height: 100%;
    transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    transform-origin: center center;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
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