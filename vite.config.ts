import { defineConfig } from 'vite';

// Relative assets work both at / and under /interactive_map/ on GitHub Pages.
export default defineConfig({ base: './' });
