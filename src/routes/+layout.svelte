<script lang="ts">
	// Css global de transição de página (não usado ativamente hoje, mantido do template)
	import './layout.css';
	// Ícone da aba do navegador
	import favicon from '$lib/assets/favicon.svg';

	// children é o conteúdo de cada página, renderizado dentro do layout
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<!-- Renderiza a página atual (home, game, rules ou credits) -->
{@render children()}