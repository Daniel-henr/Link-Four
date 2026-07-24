# Link Four

Link Four é a nossa versão do clássico **Connect Four** (conhecido no Brasil como **4 em Linha**). O objetivo é simples: dois jogadores se revezam soltando peças em um tabuleiro de 7 colunas por 6 linhas, tentando ser o primeiro a formar uma sequência de 4 peças da mesma cor — na horizontal, na vertical ou na diagonal — antes do adversário.

O projeto foi desenvolvido como trabalho da disciplina de L[ogica de Programação no IFPE, e a proposta era pegar um jogo de tabuleiro tradicional e transformá-lo em uma experiência web funcional, bonita e fácil de jogar.

## Tecnologias

O projeto foi construído com **Svelte** (SvelteKit) e **TypeScript**, tecnologias definidas pelo desafio proposto pelo professor da disciplina.

- **Svelte 5**, usando o novo sistema de *runes* (`$state`, `$derived`, `$props`) para controlar a reatividade do jogo — o estado do tabuleiro, o jogador da vez e o placar são atualizados automaticamente na tela sem a necessidade de gerenciar isso manualmente.
- **TypeScript** foi escolhido porque foi a linguagem usada pela equipe para aprender lógica de programação, o que tornou natural continuar o projeto com ela. Além disso, a tipagem ajudou a evitar erros bobos durante o desenvolvimento, como confundir o tipo de jogador (`Player`) com o tipo de célula (`Cell`) do tabuleiro.
- **Tailwind CSS** para agilizar a estilização das telas.
- **ESLint + Prettier** para manter o código padronizado entre os integrantes da equipe.
- **Vitest** para testes unitários.

## Equipe

O projeto foi desenvolvido por:

- Caio Victor Santana de Souza
- Daniel Henrique Pereira Paiva
- Guilherme Santos de Oliveira
- João Ibson Lima
- Rafael Lima Gonçalves da Silva

O time foi dividido em duas frentes de trabalho: uma parte da equipe (2 integrantes) ficou responsável pelo **design** — telas, paleta de cores, tipografia e identidade visual do jogo — enquanto a outra parte (3 integrantes) ficou responsável pelas **funcionalidades** — lógica do jogo, regras, detecção de vitória e integração do tabuleiro com o estado da aplicação.

## Processo de desenvolvimento e organização

As tarefas foram organizadas com base nos encontros presenciais em sala de aula, onde a equipe discutia o que precisava ser feito e dividia as responsabilidades entre os integrantes.

A organização dos arquivos do projeto segue uma separação clara por responsabilidade:

- `src/lib/component/` — todos os componentes Svelte reutilizáveis (tabuleiro, avatar do jogador, carrossel de regras, modal de sorteio, botão de voltar).
- `src/lib/game.svelte.ts` — toda a lógica e o estado do jogo, isolados dos componentes visuais.
- `src/routes/` — as telas da aplicação (início, jogo, regras e créditos), seguindo o roteamento por pastas do SvelteKit.
- `static/` — os arquivos de estilização (CSS), mantidos juntos e separados por tela (`home.css`, `game.css`, `rules.css`, `credits.css`, `animation.css`).

Essa separação entre lógica, componentes e estilos facilitou o trabalho em paralelo: quem estava mexendo em funcionalidades não esbarrava em quem estava ajustando o design.

## Design

A paleta de cores é construída em torno de um **azul vibrante**, escolhido por chamar atenção e passar uma sensação divertida e única — foge do azul mais "corporativo" e usa gradientes e brilhos para dar profundidade ao fundo das telas. As peças do jogo, por outro lado, seguem o **vermelho e o amarelo**, um padrão consagrado do Connect Four, escolhidos também por contrastarem bem com o azul de fundo e ficarem bem visíveis no tabuleiro.

A tipografia principal é a **Poppins**, usada em peso 800 (extra bold) e itálico nos títulos. Ela foi escolhida por transmitir leveza e diversão, com contornos arredondados que combinam com a proposta de um jogo casual.

As telas foram pensadas para serem simples de navegar e fáceis de usar: a tela inicial concentra as ações principais (jogar, ver regras, créditos) sem excesso de elementos, e as demais telas seguem a mesma identidade visual para manter consistência.

## Implementação visual

O design das telas foi traduzido em código através de componentes Svelte com CSS próprio (scoped styles), o que evita que o estilo de uma tela vaze para outra. Elementos visuais complexos, como o tabuleiro, usam variáveis CSS (`--cell-size`, `--col-gap`, `--row-gap`) para que toda a geometria — tamanho das células, espaçamento entre colunas e posição das peças — seja calculada de forma consistente, facilitando ajustes finos sem precisar mexer em vários lugares do código.

O fundo das telas usa gradientes radiais e uma grade sutil de linhas para dar profundidade, enquanto o tabuleiro em si usa sombras internas e gradientes nas peças para simular um efeito 3D (dando a impressão de peças "encaixadas" nos buracos do tabuleiro).

## Funcionalidades

O núcleo do jogo foi implementado como uma classe (`ConnectFourGame`) que guarda todo o estado da partida: o tabuleiro (uma matriz de 6x7), de quem é a vez, o placar, o status da partida (jogando, vencido, empatado ou desistido) e a última jogada feita.

O maior desafio de funcionalidade foi o próprio tabuleiro: como representá-lo e, principalmente, como detectar uma vitória — incluindo as diagonais. A solução foi:

1. Representar o tabuleiro como uma matriz de células, onde cada célula guarda `0` (vazia), `1` (peça do jogador 1) ou `2` (peça do jogador 2).
2. Criar uma função que, a partir da última peça jogada, conta quantas peças iguais existem em sequência em uma direção (`countDirection`).
3. Checar a vitória apenas a partir da última jogada, somando a contagem para os dois lados opostos de cada uma das 4 direções possíveis (horizontal, vertical e as duas diagonais) — se a soma total chegar a 4 peças, o jogo termina.

Além da lógica de vitória, o jogo conta com detecção de empate (quando o tabuleiro enche sem vencedor), opção de desistência (o jogador da vez pode desistir, dando a vitória automática ao adversário) e um placar acumulado entre partidas.

## Animações

As animações foram construídas com funções e classes CSS reutilizáveis para dar feedback visual ao jogador durante a partida:

- **Entrada e saída de tela**: classes genéricas de animação (`popIn`/`popOut`) aplicadas via CSS, usadas para fazer os elementos aparecerem crescendo e saírem encolhendo, dando uma transição mais suave entre as telas.
- **Queda da peça**: ao jogar, a peça é animada caindo do topo até a linha onde vai parar, com uma curva de aceleração que imita uma queda real (fica mais rápida conforme desce).
- **Pré-visualização (hover)**: ao passar o mouse sobre uma coluna, uma sombra e uma peça "fantasma" pulsante mostram exatamente onde a peça cairia se o jogador clicasse ali, ajudando o jogador a planejar a jogada antes de confirmar.

## Desafios e soluções

O maior desafio do projeto foi o tabuleiro: tanto em como estruturá-lo quanto em como implementar a lógica de reconhecimento de vitória, especialmente nas diagonais, que são mais difíceis de percorrer do que linhas e colunas retas.

A solução encontrada foi separar o problema em partes menores: primeiro representar o tabuleiro com constantes e estruturas simples (matriz + `each` para renderizar linhas e colunas), depois isolar a lógica de contagem de peças em uma função própria, reutilizável para qualquer direção. Para a vitória, em vez de varrer o tabuleiro inteiro a cada jogada, a verificação foi feita apenas a partir da última peça jogada, checando em todas as direções a partir dela — o que tornou a lógica mais simples e também mais eficiente.
