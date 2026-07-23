<script lang="ts">
	// How-to-play carousel for Link Four, styled with the same palette
	// (board blues, red/yellow pieces) used across the game board.

	type DrawColor = 'red' | 'yellow';

	const TOTAL_SLIDES = 5;
	const DRAW_ROLL_MS = 1300;
	const DRAW_CYCLE_MS = 3600;

	let current = $state(0);
	let touchStartX: number | null = null;

	let drawRolling = $state(false);
	let drawSettled = $state(false);
	let drawWinner = $state<DrawColor | null>(null);

	const slides = Array.from({ length: TOTAL_SLIDES }, (_, i) => i);

	function goTo(index: number): void {
		current = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowRight') goTo(current + 1);
		if (event.key === 'ArrowLeft') goTo(current - 1);
	}

	function handleTouchStart(event: TouchEvent): void {
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent): void {
		if (touchStartX === null) return;
		const dx = event.changedTouches[0].clientX - touchStartX;
		if (Math.abs(dx) > 40) {
			goTo(dx < 0 ? current + 1 : current - 1);
		}
		touchStartX = null;
	}

	function playDrawCycle(): void {
		drawSettled = false;
		drawWinner = null;
		drawRolling = true;

		setTimeout(() => {
			drawRolling = false;
			drawWinner = Math.random() < 0.5 ? 'red' : 'yellow';
			drawSettled = true;
		}, DRAW_ROLL_MS);
	}

	// Runs the color-draw demo once on mount, then loops it automatically
	// for as long as the carousel is on screen.
	$effect(() => {
		playDrawCycle();
		const intervalId = setInterval(playDrawCycle, DRAW_CYCLE_MS);
		return () => clearInterval(intervalId);
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="stage">
	<div class="carousel">
		<div class="progress-row">
			{#each slides as i (i)}
				<div class="progress-seg" class:done={i <= current}>
					<span></span>
				</div>
			{/each}
		</div>

		<div
			class="track-wrap"
			role="group"
			aria-label="Carousel: how to play Link Four"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<div class="track" style={`transform: translateX(-${current * 100}%);`}>
				<!-- SLIDE 1 — Intro -->
				<div class="slide">
					<div class="eyebrow"><span class="dot"></span>LINK FOUR</div>
					<h1 class="slide-title">Every Move <span class="accent-yellow">Counts</span></h1>
					<p class="slide-text">
						A reasoning classic: two players, a board, and four pieces in a row—that's all it
						takes. See how to play in just a few steps.
					</p>
					<div class="visual">
						<div class="mini-board">
							<div class="mini-row">
								<div class="mini-cell"></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"></div>
							</div>
							<div class="mini-row">
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"></div>
							</div>
							<div class="mini-row">
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
							</div>
						</div>
					</div>
				</div>

				<!-- SLIDE 2 — Draw demo -->
				<div class="slide">
					<div class="eyebrow"><span class="dot"></span>Step 1</div>
					<h1 class="slide-title">Draw who <span class="accent-red">goes first</span></h1>
					<p class="slide-text">
						Before the match, a random draw decides which color opens the round —
						<strong style="color: var(--red)">red</strong> or
						<strong style="color: var(--yellow)">yellow</strong>.
					</p>
					<div class="visual draw-visual">
						<div class="turn-row" class:settled={drawSettled}>
							<div class="turn-col">
								<div
									class="turn-avatar red-bg"
									class:rolling={drawRolling}
									class:winner={drawSettled && drawWinner === 'red'}
									class:loser={drawSettled && drawWinner === 'yellow'}
								>
									<div class="turn-avatar-inner red"></div>
								</div>
								<div class="turn-label" class:winner-label={drawSettled && drawWinner === 'red'}>
									PLAYER 1
								</div>
							</div>

							<span class="vs">VS</span>

							<div class="turn-col">
								<div
									class="turn-avatar yellow-bg"
									class:rolling={drawRolling}
									class:winner={drawSettled && drawWinner === 'yellow'}
									class:loser={drawSettled && drawWinner === 'red'}
								>
									<div class="turn-avatar-inner yellow"></div>
								</div>
								<div class="turn-label" class:winner-label={drawSettled && drawWinner === 'yellow'}>
									PLAYER 2
								</div>
							</div>
						</div>

						<p class="draw-result">
							{#if drawSettled && drawWinner === 'red'}
								<span class="red-txt">Red</span> goes first!
							{:else if drawSettled && drawWinner === 'yellow'}
								<span class="yellow-txt">Yellow</span> goes first!
							{:else}
								&nbsp;
							{/if}
						</p>
					</div>
				</div>

				<!-- SLIDE 3 — How to play (drop) -->
				<div class="slide">
					<div class="eyebrow"><span class="dot"></span>Step 2</div>
					<h1 class="slide-title">Drop your piece in a <span class="accent-yellow">column</span></h1>
					<p class="slide-text">
						On your turn, pick a column. Your piece falls on its own until it lands on the
						lowest open spot in that column.
					</p>
					<div class="visual">
						<div class="drop-demo">
							<span class="col-arrow">▼</span>
							<div class="mini-board">
								<div class="mini-row">
									<div class="mini-cell"></div>
									<div class="mini-cell falling"><div class="mini-piece red"></div></div>
									<div class="mini-cell"></div>
									<div class="mini-cell"></div>
								</div>
								<div class="mini-row">
									<div class="mini-cell"></div>
									<div class="mini-cell"></div>
									<div class="mini-cell"></div>
									<div class="mini-cell"></div>
								</div>
								<div class="mini-row">
									<div class="mini-cell"></div>
									<div class="mini-cell"><div class="mini-piece yellow"></div></div>
									<div class="mini-cell"></div>
									<div class="mini-cell"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- SLIDE 4 — Ways to win -->
				<div class="slide">
					<div class="eyebrow"><span class="dot"></span>Step 3</div>
					<h1 class="slide-title">4 ways to <span class="accent-red">win</span></h1>
					<p class="slide-text">
						Connect 4 pieces of your color in any of these directions to win the round.
					</p>
					<div class="visual">
						<div class="win-grid">
							<div class="win-card">
								<div class="mini-board">
									<div class="mini-row">
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
									</div>
								</div>
								<span>HORIZONTAL</span>
							</div>
							<div class="win-card">
								<div class="mini-board">
									<div class="mini-row"><div class="mini-cell win"><div class="mini-piece yellow"></div></div></div>
									<div class="mini-row"><div class="mini-cell win"><div class="mini-piece yellow"></div></div></div>
									<div class="mini-row"><div class="mini-cell win"><div class="mini-piece yellow"></div></div></div>
									<div class="mini-row"><div class="mini-cell win"><div class="mini-piece yellow"></div></div></div>
								</div>
								<span>VERTICAL</span>
							</div>
							<div class="win-card">
								<div class="mini-board">
									<div class="mini-row">
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
									</div>
									<div class="mini-row">
										<div class="mini-cell"></div>
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
									</div>
									<div class="mini-row">
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
										<div class="mini-cell"></div>
									</div>
									<div class="mini-row">
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell win"><div class="mini-piece red"></div></div>
									</div>
								</div>
								<span>DIAGONAL ↘</span>
							</div>
							<div class="win-card">
								<div class="mini-board">
									<div class="mini-row">
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell win"><div class="mini-piece yellow"></div></div>
									</div>
									<div class="mini-row">
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell win"><div class="mini-piece yellow"></div></div>
										<div class="mini-cell"></div>
									</div>
									<div class="mini-row">
										<div class="mini-cell"></div>
										<div class="mini-cell win"><div class="mini-piece yellow"></div></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
									</div>
									<div class="mini-row">
										<div class="mini-cell win"><div class="mini-piece yellow"></div></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
										<div class="mini-cell"></div>
									</div>
								</div>
								<span>DIAGONAL ↙</span>
							</div>
						</div>
					</div>
				</div>

				<!-- SLIDE 5 — Draw / End -->
				<div class="slide">
					<div class="eyebrow"><span class="dot"></span>Step 4</div>
					<h1 class="slide-title">Draw or <span class="accent-yellow">forfeit</span></h1>
					<p class="slide-text">
						If the board fills up with no one connecting 4 in a row, the game ends in a draw.
						A player can also forfeit on their turn, handing the win to their opponent.
					</p>
					<div class="visual end-visual">
						<div class="mini-board">
							<div class="mini-row">
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
							</div>
							<div class="mini-row">
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
							</div>
							<div class="mini-row">
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
								<div class="mini-cell"><div class="mini-piece red"></div></div>
								<div class="mini-cell"><div class="mini-piece yellow"></div></div>
							</div>
						</div>
						<div class="end-badges">
							<div class="end-badge">DRAW</div>
							<div class="end-badge">FORFEIT</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="controls">
			<button
				type="button"
				class="nav-btn"
				aria-label="Previous"
				disabled={current === 0}
				onclick={() => goTo(current - 1)}
			>
				‹
			</button>

			<div class="dots">
				{#each slides as i (i)}
					<button
						type="button"
						class="dot-btn"
						class:alt={i % 2 === 1}
						class:active={i === current}
						aria-label={`Go to step ${i + 1}`}
						onclick={() => goTo(i)}
					></button>
				{/each}
			</div>

			<button
				type="button"
				class="nav-btn"
				aria-label="Next"
				disabled={current === TOTAL_SLIDES - 1}
				onclick={() => goTo(current + 1)}
			>
				›
			</button>
		</div>
	</div>
</div>

<style>
	.stage {
		--board-blue-1: #0141bd;
		--board-blue-2: #0129ac;
		--board-border: #16bdfc;
		--cell-blue: #021e72;
		--deep-navy: #010e3d;
		--red: #db181f;
		--red-dark: #c21319;
		--yellow: #fcba01;
		--yellow-dark: #e19100;
		--ink: #eaf1ff;
		--ink-dim: #9fb3e8;

		width: 100%;
		max-width: 640px;
		margin: 0 auto;
		font-family: 'Poppins', sans-serif;
		color: var(--ink);
	}

	.carousel {
		position: relative;
		border-radius: 2rem;
		background: linear-gradient(135deg, var(--board-blue-1) 6%, var(--board-blue-2) 55%, #011a80 100%);
		border: 1px solid var(--board-border);
		box-shadow:
			0px 8px 0px #0123ab,
			0px 30px 40px rgba(1, 20, 90, 0.55);
		overflow: hidden;
	}

	.progress-row {
		display: flex;
		gap: 6px;
		padding: 20px 24px 0 24px;
	}
	.progress-seg {
		flex: 1;
		height: 5px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.15);
		overflow: hidden;
	}
	.progress-seg span {
		display: block;
		height: 100%;
		width: 0%;
		background: var(--board-border);
		box-shadow: 0 0 10px var(--board-border);
		transition: width 0.35s ease;
	}
	.progress-seg.done span {
		width: 100%;
	}

	.track-wrap {
		overflow: hidden;
	}
	.track {
		display: flex;
		transition: transform 0.45s cubic-bezier(0.4, 0.1, 0.2, 1);
	}

	.slide {
		flex: 0 0 100%;
		padding: 28px 30px 30px 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		min-height: 480px;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--board-border);
		margin-bottom: 14px;
	}
	.eyebrow .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--board-border);
		box-shadow: 0 0 8px var(--board-border);
	}

	.slide-title {
		font-weight: 800;
		font-size: 26px;
		line-height: 1.25;
		margin: 0 0 10px 0;
		letter-spacing: 0.01em;
	}
	.slide-title .accent-red {
		color: var(--red);
	}
	.slide-title .accent-yellow {
		color: var(--yellow);
	}

	.slide-text {
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink-dim);
		max-width: 400px;
		margin: 0 0 22px 0;
		font-weight: 400;
	}

	.visual {
		flex: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 210px;
	}
	.draw-visual,
	.end-visual {
		flex-direction: column;
		gap: 20px;
	}

	.mini-board {
		display: inline-flex;
		flex-direction: column;
		gap: 6px;
		padding: 10px;
		background: var(--cell-blue);
		border-radius: 1rem;
		border: 1px solid rgba(22, 189, 252, 0.35);
		box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.35);
	}
	.mini-row {
		display: flex;
		gap: 6px;
	}
	.mini-cell {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: #011449;
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.4);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mini-piece {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		box-shadow:
			inset 1px 2px 3px rgba(255, 255, 255, 0.45),
			inset -4px -8px 5px rgba(0, 0, 0, 0.25);
	}
	.mini-piece.red {
		background: var(--red);
	}
	.mini-piece.yellow {
		background: var(--yellow);
	}
	.mini-cell.win {
		box-shadow:
			0 0 0 2px var(--board-border),
			inset 0px 3px 5px rgba(0, 0, 0, 0.4);
	}
	.mini-cell.win .mini-piece {
		box-shadow:
			0 0 12px 2px rgba(22, 189, 252, 0.85),
			inset 1px 2px 3px rgba(255, 255, 255, 0.45);
	}

	@keyframes drop-fall {
		0% {
			transform: translateY(-150px);
		}
		70% {
			transform: translateY(0px);
		}
		85% {
			transform: translateY(-8px);
		}
		100% {
			transform: translateY(0px);
		}
	}
	.mini-cell.falling .mini-piece {
		animation: drop-fall 1.4s cubic-bezier(0.4, 1.1, 0.6, 1) infinite;
	}

	.drop-demo {
		position: relative;
	}
	.col-arrow {
		position: absolute;
		top: -26px;
		left: 76px;
		font-size: 13px;
		color: var(--board-border);
		animation: bob 1.4s ease-in-out infinite;
	}
	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(4px);
		}
	}

	.turn-row {
		display: flex;
		gap: 26px;
		align-items: center;
		justify-content: center;
	}
	.turn-col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.turn-avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			inset 1px 2px 4px rgba(255, 255, 255, 0.45),
			inset -5px -12px 4px rgba(0, 0, 0, 0.25);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			opacity 0.3s ease;
	}
	.turn-avatar.red-bg {
		background: var(--red-dark);
	}
	.turn-avatar.yellow-bg {
		background: var(--yellow-dark);
	}
	.turn-avatar.rolling {
		animation: shake 0.12s linear infinite;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-3px) scale(1.03);
		}
	}
	.turn-avatar.winner {
		transform: scale(1.18);
		box-shadow:
			inset 1px 2px 4px rgba(255, 255, 255, 0.45),
			inset -5px -12px 4px rgba(0, 0, 0, 0.25),
			0 0 0 3px var(--board-border),
			0 0 22px 4px rgba(22, 189, 252, 0.7);
	}
	.turn-avatar.loser {
		opacity: 0.35;
	}
	.turn-avatar-inner {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		box-shadow: inset 1px 2px 3px rgba(255, 255, 255, 0.45);
	}
	.turn-avatar-inner.red {
		background: var(--red);
	}
	.turn-avatar-inner.yellow {
		background: var(--yellow);
	}
	.turn-label {
		font-size: 12px;
		margin-top: 8px;
		color: var(--ink-dim);
		font-weight: 600;
		letter-spacing: 0.05em;
		transition: opacity 0.25s ease;
	}
	.vs {
		font-size: 12px;
		color: var(--ink-dim);
		font-weight: 700;
		letter-spacing: 0.15em;
		transition: opacity 0.25s ease;
	}
	.turn-row.settled .turn-label,
	.turn-row.settled .vs {
		opacity: 0.4;
	}
	.turn-row.settled .turn-label.winner-label {
		opacity: 1;
		color: var(--board-border);
		font-weight: 700;
	}

	.draw-result {
		min-height: 18px;
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: 0.03em;
		margin: 0;
		color: var(--ink);
	}
	.draw-result .red-txt {
		color: var(--red);
	}
	.draw-result .yellow-txt {
		color: var(--yellow);
	}

	.win-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}
	.win-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.win-card span {
		font-size: 11px;
		color: var(--ink-dim);
		font-weight: 600;
		letter-spacing: 0.03em;
	}

	.end-badges {
		display: flex;
		gap: 14px;
		margin-top: 4px;
	}
	.end-badge {
		padding: 8px 14px;
		border-radius: 99px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		border: 1px solid rgba(255, 255, 255, 0.18);
		color: var(--ink);
		background: rgba(255, 255, 255, 0.04);
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 22px 22px 22px;
	}
	.nav-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid rgba(22, 189, 252, 0.4);
		background: rgba(255, 255, 255, 0.04);
		color: var(--board-border);
		font-size: 16px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			transform 0.15s ease,
			background 0.15s ease;
	}
	.nav-btn:hover {
		background: rgba(22, 189, 252, 0.15);
		transform: translateY(-1px);
	}
	.nav-btn:active {
		transform: translateY(0px) scale(0.96);
	}
	.nav-btn:disabled {
		opacity: 0.3;
		cursor: default;
		transform: none;
		background: rgba(255, 255, 255, 0.04);
	}

	.dots {
		display: flex;
		gap: 9px;
	}
	.dot-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		padding: 0;
		cursor: pointer;
		background: #0a2a8f;
		box-shadow: inset 1px 2px 3px rgba(0, 0, 0, 0.3);
		transition:
			background 0.25s ease,
			transform 0.2s ease;
	}
	.dot-btn.active {
		background: var(--red);
		transform: scale(1.15);
	}
	.dot-btn.active.alt {
		background: var(--yellow);
	}

	@media (prefers-reduced-motion: reduce) {
		.mini-cell.falling .mini-piece,
		.col-arrow,
		.turn-avatar.rolling {
			animation: none;
		}
	}

	@media (max-width: 420px) {
		.slide {
			padding: 22px 18px 26px 18px;
			min-height: 520px;
		}
		.slide-title {
			font-size: 22px;
		}
	}
</style>