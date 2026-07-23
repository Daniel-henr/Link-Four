// Lógica principal do jogo da velha 4 em linha (Connect Four) e o estado reativo (Svelte 5 runes).

// Quantidade de linhas do tabuleiro
export const ROWS = 6;
// Quantidade de colunas do tabuleiro
export const COLS = 7;

// Cada célula do tabuleiro: 0 = vazia, 1 = peça do jogador 1, 2 = peça do jogador 2
export type Cell = 0 | 1 | 2;
// O tabuleiro é uma matriz (linhas x colunas) de células
export type Board = Cell[][];
// Os dois jogadores possíveis
export type Player = 1 | 2;
// Situação atual da partida
export type GameStatus = 'playing' | 'won' | 'draw' | 'forfeited';

// Guarda onde foi a última jogada, pra sabermos qual peça animar caindo
export interface LastMove {
	row: number;
	col: number;
	player: Player;
}

// Cria um tabuleiro novo, todo zerado (todas as células vazias)
function createEmptyBoard(): Board {
	return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

// Conta quantas peças iguais tem em sequência, andando em uma única direção (ex: só pra direita)
function countDirection(board: Board, row: number, col: number, dRow: number, dCol: number, player: Cell): number {
	let count = 0;
	let r = row + dRow;
	let c = col + dCol;

	// Anda casa por casa na direção escolhida enquanto continuar dentro do tabuleiro e for peça do mesmo jogador
	while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
		count++;
		r += dRow;
		c += dCol;
	}

	return count;
}

// Verifica se a última jogada formou 4 peças em linha (horizontal, vertical ou nas duas diagonais)
function checkWin(board: Board, row: number, col: number, player: Cell): boolean {
	// As 4 direções possíveis de vitória (cada uma já cobre os dois sentidos, ex: esquerda e direita)
	const directions: [number, number][] = [
		[0, 1], // horizontal
		[1, 0], // vertical
		[1, 1], // diagonal descendo pra direita
		[1, -1] // diagonal descendo pra esquerda
	];

	for (const [dRow, dCol] of directions) {
		// Soma a peça jogada + quantas peças iguais tem pra um lado + quantas tem pro lado oposto
		const total =
			1 + countDirection(board, row, col, dRow, dCol, player) + countDirection(board, row, col, -dRow, -dCol, player);
		if (total >= 4) return true;
	}

	return false;
}

// Função de empate: verifica se todas as células da primeira linha estão preenchidas, ou seja, o tabuleiro está cheio
function isBoardFull(board: Board): boolean {
	return board[0].every((cell) => cell !== 0);
}

// Classe que guarda todo o estado do jogo, compartilhada pela tela do jogo inteira
class ConnectFourGame {
	// Estado do tabuleiro (matriz de células)
	board = $state<Board>(createEmptyBoard());
	// De quem é a vez de jogar agora
	currentPlayer = $state<Player>(1);
	// Situação atual da partida (jogando, ganhou, empatou ou desistiu)
	status = $state<GameStatus>('playing');
	// Quem venceu a partida (ou null se ainda não tem vencedor)
	winner = $state<Player | null>(null);
	// Placar acumulado dos dois jogadores
	scores = $state({ player1: 0, player2: 0 });
	// true enquanto uma peça ainda está caindo (animação em andamento)
	isDropping = $state(false);
	// Guarda a última jogada mesmo depois da animação terminar, pra tela poder saber onde a peça caiu
	lastMove = $state<LastMove | null>(null);
	// Trava a partida até o sorteio de quem começa ser resolvido (fica false até o modal de sorteio liberar)
	readyToPlay = $state(false);

	// Verifica se a partida já acabou (não está mais no status "jogando")
	isGameOver(): boolean {
		return this.status !== 'playing';
	}

	// Verifica se uma coluna já está cheia (sem espaço pra mais peças)
	isColumnFull(col: number): boolean {
		return this.board[0][col] !== 0;
	}

	// Calcula quanto tempo (em milissegundos) a peça demora pra cair até a linha informada
	dropDurationMs(row: number): number {
		return 420 + row * 60;
	}

	// Calcula em qual linha a peça vai parar se for jogada nessa coluna, sem jogar de verdade.
	// Usado pra mostrar a "sombra" de preview ao passar o mouse. Retorna null se a coluna estiver cheia.
	dropRow(col: number): number | null {
		for (let r = ROWS - 1; r >= 0; r--) {
			if (this.board[r][col] === 0) return r;
		}
		return null;
	}

	// Só pode desistir quem está com a vez, enquanto o jogo não tiver acabado e o sorteio já tiver sido feito
	canForfeit(player: Player): boolean {
		return this.readyToPlay && !this.isGameOver() && this.currentPlayer === player;
	}

	// Resolve o sorteio obrigatório de início de partida: define quem começa jogando e libera o tabuleiro
	beginMatch(startingPlayer: Player): void {
		this.currentPlayer = startingPlayer;
		this.readyToPlay = true;
	}

	// Faz a jogada: solta uma peça na coluna escolhida
	play(col: number): void {
		// Não deixa jogar antes do sorteio, se já tiver uma peça caindo, ou se o jogo já acabou
		if (!this.readyToPlay || this.isDropping || this.isGameOver()) return;
		// Não deixa jogar em coluna cheia
		if (this.isColumnFull(col)) return;

		// Procura a linha mais baixa vazia da coluna (é ali que a peça realmente vai parar)
		let targetRow = -1;
		for (let r = ROWS - 1; r >= 0; r--) {
			if (this.board[r][col] === 0) {
				targetRow = r;
				break;
			}
		}
		if (targetRow === -1) return;

		const player = this.currentPlayer;
		// Copia o tabuleiro pra não alterar o estado antigo direto (assim o Svelte percebe a mudança)
		const nextBoard = this.board.map((row) => row.slice()) as Board;
		nextBoard[targetRow][col] = player;

		this.board = nextBoard;
		this.lastMove = { row: targetRow, col, player };
		this.isDropping = true;

		// Espera a animação de queda terminar antes de resolver o turno (verificar vitória, empate etc.)
		const duration = this.dropDurationMs(targetRow);
		setTimeout(() => {
			this.isDropping = false;
			this.resolveTurn(targetRow, col, player);
		}, duration);
	}

	// Depois que a peça termina de cair, checa se alguém ganhou, empatou ou se o jogo continua
	private resolveTurn(row: number, col: number, player: Player): void {
		if (checkWin(this.board, row, col, player)) {
			this.status = 'won';
			this.winner = player;
			this.awardPoint(player);
		} else if (isBoardFull(this.board)) {
			this.status = 'draw';
		} else {
			// Passa a vez pro outro jogador
			this.currentPlayer = player === 1 ? 2 : 1;
		}
	}

	// Soma um ponto no placar do jogador que venceu
	private awardPoint(player: Player): void {
		if (player === 1) this.scores.player1 += 1;
		else this.scores.player2 += 1;
	}

	// Um jogador desiste da partida: o outro jogador vence automaticamente
	forfeit(player: Player): void {
		if (!this.canForfeit(player)) return;

		const winner: Player = player === 1 ? 2 : 1;
		this.status = 'forfeited';
		this.winner = winner;
		this.awardPoint(winner);
	}

	// Reinicia a partida: limpa o tabuleiro e volta tudo pro estado inicial (mantém o placar)
	// Exige um novo sorteio antes da próxima partida começar
	restart(): void {
		this.board = createEmptyBoard();
		this.currentPlayer = 1;
		this.status = 'playing';
		this.winner = null;
		this.isDropping = false;
		this.lastMove = null;
		this.readyToPlay = false;
	}
}

// Instância única do jogo, usada em todas as telas
export const game = new ConnectFourGame();