<script lang="ts">
	// Estado do jogo + constante de colunas
	import { game, COLS } from '$lib/game.svelte';

	// Css com as animações de entrada/saída de tela (popIn/popOut)
	import '../../../static/animation.css';

	// Recebe da página o "isExiting" (true quando a tela do jogo está fechando)
	let { isExitingStore } = $props();

	// Lista de 0 até 6, uma posição pra cada coluna do tabuleiro
	const columns = Array.from({ length: COLS }, (_, i) => i);

	// A peça "caindo" só existe enquanto isDropping for true (senão fica null)
	const fallingPiece = $derived(game.isDropping ? game.lastMove : null);

	// Qual coluna o mouse está sobrevoando agora (null = nenhuma)
	let hoveredCol = $state<number | null>(null);

	// Só mostra o preview se der pra jogar de verdade agora (sorteio feito, sem peça caindo, jogo não acabou)
	const canPreview = $derived(game.readyToPlay && !game.isDropping && !game.isGameOver());

	// Em qual linha a peça cairia se você clicasse agora na coluna sobrevoada (null = coluna cheia ou sem hover)
	const previewRow = $derived(
		canPreview && hoveredCol !== null ? game.dropRow(hoveredCol) : null
	);

	function handleColumnEnter(colIndex: number): void {
		hoveredCol = colIndex;
	}

	function handleColumnLeave(colIndex: number): void {
		if (hoveredCol === colIndex) hoveredCol = null;
	}
</script>

<div class="board-shell animate" class:closing={$isExitingStore}>
	<div class="board">
		{#each game.board as row, rowIndex (rowIndex)}
			<div class="row">
				{#each row as cell, colIndex (colIndex)}
					<div class="cell">
						<!-- Enquanto a peça ainda tá caindo nessa célula, escondemos a peça parada -->
						<!-- (só a bolinha animada aparece; quando a queda termina, a peça parada aparece de vez) -->
						{#if cell !== 0 && !(fallingPiece && fallingPiece.row === rowIndex && fallingPiece.col === colIndex)}
							<div class="piece" class:piece-red={cell === 1} class:piece-yellow={cell === 2}></div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}

		{#if fallingPiece}
			<!-- Bolinha que anima caindo: começa no topo da coluna e desce até a linha onde vai parar -->
			<div
				class="falling-piece"
				class:piece-red={fallingPiece.player === 1}
				class:piece-yellow={fallingPiece.player === 2}
				style={`
					--col: ${fallingPiece.col};
					--end-row: ${fallingPiece.row};
					animation-duration: ${game.dropDurationMs(fallingPiece.row)}ms;
				`}
			></div>
		{/if}

		{#if hoveredCol !== null && previewRow !== null}
			<!-- Sombra na coluna inteira, indicando qual coluna vai receber a peça -->
			<div
				class="column-shadow"
				style={`--col: ${hoveredCol};`}
			></div>

			<!-- Peça-fantasma exatamente na lacuna onde a peça vai parar -->
			<div
				class="ghost-piece"
				class:piece-red={game.currentPlayer === 1}
				class:piece-yellow={game.currentPlayer === 2}
				style={`--col: ${hoveredCol}; --end-row: ${previewRow};`}
			></div>
		{/if}
	</div>

	<div class="column-overlay">
		{#each columns as colIndex (colIndex)}
			<!-- Um botão transparente por cima de cada coluna, pra clicar e jogar -->
			<button
				type="button"
				class="column-button"
				aria-label={`Drop piece in column ${colIndex + 1}`}
				disabled={game.isDropping || game.isGameOver() || game.isColumnFull(colIndex)}
				onmouseenter={() => handleColumnEnter(colIndex)}
				onmouseleave={() => handleColumnLeave(colIndex)}
				onfocus={() => handleColumnEnter(colIndex)}
				onblur={() => handleColumnLeave(colIndex)}
				onclick={() => game.play(colIndex)}
			></button>
		{/each}
	</div>
</div>

<style>
	/* Variáveis com as medidas do tabuleiro, usadas depois pra calcular a posição da bolinha caindo */
	.board {
		--cell-size: 75px;
		--col-gap: 1.1rem;
		--row-gap: 0.5rem;
		--board-padding: 1rem;

		position: relative;
		display: inline-block;
		background: linear-gradient(135deg, rgba(1, 65, 189, 1) 6%, rgba(1, 41, 172, 1) 29%);
		border: #16bdfc solid 1px;
		box-shadow:
			0px 8px 0px #0123ab,
			0px 23px 15px rgba(1, 35, 171, 0.75);
		padding: var(--board-padding);
		border-radius: 2rem;
	}

	.board-shell {
		position: relative;
		display: inline-block;
	}

	.row {
		display: flex;
		gap: var(--col-gap);
		margin-bottom: var(--row-gap);
	}

	/* Cada buraco do tabuleiro (esconde a peça até ela ficar dentro do buraco) */
	.cell {
		width: var(--cell-size);
		height: var(--cell-size);
		background-color: #021e72;
		border: 1px inset rgba(255, 255, 255, 0.3);
		border-radius: 100%;
		box-shadow: inset 0px 4px 8px 0px rgba(0, 0, 0, 0.35);
		overflow: hidden;
	}

	/* Estilo da bolinha (tanto a parada quanto a que tá caindo) */
	.piece,
	.falling-piece,
	.ghost-piece {
		border-radius: 100%;
		box-shadow:
			inset 1px 1px 2px 0px rgba(255, 255, 255, 0.45),
			inset -3px -6px 6px 0px rgba(0, 0, 0, 0.25);
	}

	.piece {
		width: 100%;
		height: 100%;
	}

	/* Cor da peça do jogador 1 */
	.piece-red {
		background: radial-gradient(circle at 30% 30%, #ff4d4d, #b30000);
	}

	/* Cor da peça do jogador 2 */
	.piece-yellow {
		background: radial-gradient(circle at 30% 30%, #fcba01, #e19100);
	}

	/* Bolinha "flutuante" que fica por cima de todo o tabuleiro enquanto cai, pra atravessar os buracos vazios */
	.falling-piece {
		position: absolute;
		width: var(--cell-size);
		height: var(--cell-size);
		z-index: 5;
		/* Posição horizontal calculada de acordo com a coluna escolhida */
		left: calc(var(--board-padding) + var(--col) * (var(--cell-size) + var(--col-gap)));
		/* Começa sempre no topo (primeiro buraco disponível da coluna) */
		top: var(--board-padding);
		animation-name: piece-fall;
		/* Queda reta, acelerando (feito uma queda real), sem passar do lugar certo e voltar */
		animation-timing-function: cubic-bezier(0.45, 0, 0.8, 0.7);
		animation-fill-mode: forwards;
		pointer-events: none;
	}

	/* Passo a passo da queda: sai do topo (from) e desce até a linha onde a peça realmente para (to) */
	@keyframes piece-fall {
		from {
			top: var(--board-padding);
		}
		to {
			top: calc(var(--board-padding) + var(--end-row) * (var(--cell-size) + var(--row-gap)));
		}
	}

	/* Sombra que preenche a coluna inteira sob o mouse, indicando por onde a peça vai passar */
	.column-shadow {
		position: absolute;
		z-index: 1;
		top: var(--board-padding);
		bottom: var(--board-padding);
		width: var(--cell-size);
		left: calc(var(--board-padding) + var(--col) * (var(--cell-size) + var(--col-gap)));
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05));
		border-radius: 999px;
		pointer-events: none;
		animation: shadow-fade-in 0.15s ease-out;
	}

	@keyframes shadow-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Peça-fantasma: mostra, translúcida, exatamente onde a peça real vai parar */
	.ghost-piece {
		position: absolute;
		z-index: 2;
		width: var(--cell-size);
		height: var(--cell-size);
		left: calc(var(--board-padding) + var(--col) * (var(--cell-size) + var(--col-gap)));
		top: calc(var(--board-padding) + var(--end-row) * (var(--cell-size) + var(--row-gap)));
		opacity: 0.45;
		pointer-events: none;
		animation:
			shadow-fade-in 0.15s ease-out,
			ghost-pulse 1.1s ease-in-out infinite;
	}

	@keyframes ghost-pulse {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 0.55;
		}
	}

	/* Camada transparente com um botão por coluna, por cima do tabuleiro, pra capturar o clique */
	.column-overlay {
		position: absolute;
		inset: 0;
		z-index: 6;
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
	}

	.column-button {
		flex: 1;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}

	/* Coluna cheia ou jogo travado: mostra que não dá pra clicar ali */
	.column-button:disabled {
		cursor: not-allowed;
	}

	@media (prefers-reduced-motion: reduce) {
		.ghost-piece {
			animation: none;
			opacity: 0.45;
		}
		.column-shadow {
			animation: none;
		}
	}
</style>