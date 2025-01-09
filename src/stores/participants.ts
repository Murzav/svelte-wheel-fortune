import { writable } from 'svelte/store';

// Initial list of participants
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