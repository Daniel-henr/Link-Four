<script lang="ts">
	//Define as cores pra cada jogador
	const colors = {
		1: {
			background: '#C21319',
			inner: '#DB181F'
		},
		2: {
			background: '#E19100',
			inner: '#FCBA01'
		}
	};

	// Quem é o jogador (1 ou 2) e o tamanho da bolinha em pixels
	let { player, size = 109 }: { player: 1 | 2; size?: number } = $props();
</script>

<!-- Bolinha de fora (mais escura) com a bolinha de dentro (mais clara) por cima, dando o efeito 3D -->
<div
	class="avatar-background"
	style:background-color={colors[player].background}
	style:width="{size}px"
	style:height="{size}px"
>
	<div class="avatar-inner" style:background-color={colors[player].inner}></div>
</div>

<style>
	/* Bolinha de fora: define o tamanho e a sombra que dá o efeito de volume */
	.avatar-background {
		border-radius: 100vh;
		box-shadow:
			inset 1px 2px 4px 0px rgba(255, 255, 255, 0.45),
			inset -5px -15px 4px 0px rgba(0, 0, 0, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	/* Bolinha de dentro: menor e mais clara, fica centralizada na de fora */
	.avatar-inner {
		width: 72.5%;
		aspect-ratio: 1/1;
		border-radius: 100vh;
		box-shadow: inset 1px 2px 3px 0px rgba(255, 255, 255, 0.45);
	}
</style>
