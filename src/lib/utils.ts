import { writable } from 'svelte/store';

// Cria o controle da animação de saída de uma tela (usado antes de trocar de página)
export function createExitAnimation(duration = 500) {
	// Guarda se a tela está "fechando" agora (liga a classe .closing no HTML)
	const isExiting = writable(false);

	// Liga a animação de saída e só troca de página depois que ela termina
	function animateExit(path: string) {
		isExiting.set(true);
		// Espera o tempo da animação (mesmo tempo do CSS) antes de navegar de verdade
		setTimeout(() => {
			window.location.href = path;
		}, duration);
	}

	return { isExiting, animateExit };
}
