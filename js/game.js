const canvas = document.getElementById("tetris"); const context = canvas.getContext("2d"); context.scale(20, 20);

const ROWS = 20; const COLUMNS = 10; let isPaused = false; let lastTime = 0; let dropCounter = 0; const dropInterval = 500;

const COLORS = [null, "cyan", "blue", "orange", "yellow", "green", "purple", "red"]; const SHAPES = [ [], [[1, 1, 1, 1]], [[0, 2, 0], [2, 2, 2]], [[3, 3], [3, 3]], [[0, 4, 4], [4, 4, 0]], [[5, 5, 0], [0, 5, 5]], [[6, 0, 0], [6, 6, 6]], [[0, 0, 7], [7, 7, 7]] ];

function createMatrix(rows, cols) { return Array.from({ length: rows }, () => Array(cols).fill(0)); }

function rotate(matrix) { return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse(); }

const arena = createMatrix(ROWS, COLUMNS); let player = { pos: { x: 4, y: 0 }, matrix: [], score: 0 };

function createPiece(type) { return SHAPES[type]; }

function collide(arena, player) { return player.matrix.some((row, y) => row.some((value, x) => value !== 0 && (arena[y + player.pos.y] && arena[y + player.pos.y][x + player.pos.x]) !== 0)); }

function merge(arena, player) { player.matrix.forEach((row, y) => row.forEach((value, x) => { if (value !== 0) { arena[y + player.pos.y][x + player.pos.x] = value; } })); }

function clearLines() { arena.forEach((row, y) => { if (row.every(value => value !== 0)) { arena.splice(y, 1); arena.unshift(new Array(COLUMNS).fill(0)); player.score += 10; } }); }

function move(dir) { player.pos.x += dir; if (collide(arena, player)) { player.pos.x -= dir; } }

function rotatePiece() { const prevMatrix = player.matrix; player.matrix = rotate(player.matrix); if (collide(arena, player)) { player.matrix = prevMatrix; } }

function drop() { player.pos.y++; if (collide(arena, player)) { player.pos.y--; merge(arena, player); clearLines(); player.matrix = createPiece(Math.floor(Math.random() * 7) + 1); player.pos = { x: 4, y: 0 }; if (collide(arena, player)) { alert("Game Over"); showGameOver(); return; } } dropCounter = 0; }

function restartGame() { arena.forEach(row => row.fill(0)); player.score = 0; player.matrix = createPiece(Math.floor(Math.random() * 7) + 1); player.pos = { x: 4, y: 0 }; hideGameOver(); isPaused = false; }

function draw() { context.fillStyle = "#000"; context.fillRect(0, 0, canvas.width, canvas.height); drawMatrix(arena, { x: 0, y: 0 }); drawMatrix(player.matrix, player.pos); }

function drawMatrix(matrix, offset) { matrix.forEach((row, y) => { row.forEach((value, x) => { if (value !== 0) { context.fillStyle = COLORS[value]; context.fillRect(x + offset.x, y + offset.y, 1, 1); } }); }); }

function update(time = 0) { if (!isPaused) { const deltaTime = time - lastTime; lastTime = time; dropCounter += deltaTime; if (dropCounter > dropInterval) { drop(); } draw(); } requestAnimationFrame(update); }

document.addEventListener("keydown", event => { if (event.key === "ArrowLeft") move(-1); else if (event.key === "ArrowRight") move(1); else if (event.key === "ArrowDown") drop(); else if (event.key === "ArrowUp") rotatePiece(); });

function showGameOver() { document.getElementById("gameOverControls")?.style.setProperty("display", "block"); isPaused = true; }

function hideGameOver() { document.getElementById("gameOverControls")?.style.setProperty("display", "none"); }

window.addEventListener("load", () => { const pauseBtn = document.getElementById("pauseBtn"); const unpauseBtn = document.getElementById("unpauseBtn"); const dropBtn = document.getElementById("dropBtn"); const leftBtn = document.getElementById("leftBtn"); const rightBtn = document.getElementById("rightBtn"); const rotateBtn = document.getElementById("rotateBtn"); const restartBtn = document.getElementById("restartBtn");

pauseBtn?.addEventListener("click", () => {
    isPaused = true;
    pauseBtn.style.display = "none";
    unpauseBtn.style.display = "inline-block";
});

unpauseBtn?.addEventListener("click", () => {
    isPaused = false;
    unpauseBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    update();
});

dropBtn?.addEventListener("click", drop);
leftBtn?.addEventListener("click", () => move(-1));
rightBtn?.addEventListener("click", () => move(1));
rotateBtn?.addEventListener("click", rotatePiece);
restartBtn?.addEventListener("click", restartGame);

player.matrix = createPiece(Math.floor(Math.random() * 7) + 1);
console.log("Juego iniciado");
update();

});

