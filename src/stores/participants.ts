import { writable } from 'svelte/store';

const initialParticipants = [
  'Bor',
  'Spesh',
  'Canada',
  'Giddy',
  'Seraf',
  'Mugr',
  'Elf',
  'Posmishka'
];

export const participants = writable<string[]>(initialParticipants);
export const selectedParticipants = writable<string[]>([]);