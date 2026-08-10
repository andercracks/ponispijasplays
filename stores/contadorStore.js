// src/stores/contadorStore.js
import { writable } from 'svelte/store';

// Creamos un contador global que empieza en 0
export const contadorFormularios = writable(0);
