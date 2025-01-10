import { writable } from 'svelte/store';

const initialParticipants = [
  'Human 1',
  'Human 2',
  'Human 3',
  'Human 4',
  'Human 5',
  'Human 6',
  'Human 7',
  'Human 8'
];

export const participants = writable<string[]>(initialParticipants);
export const selectedParticipants = writable<string[]>([]);