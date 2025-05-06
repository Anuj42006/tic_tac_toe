document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);

    async function handleCellClick(e) {
        const cell = e.target;
        const position = cell.dataset.index;

        try {
            const response = await fetch('/make_move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ position: position })
            });

            const data = await response.json();

            if (data.success) {
                updateBoard(data.board);
                
                if (data.winner) {
                    status.textContent = `Player ${data.winner} wins!`;
                    disableBoard();
                } else if (data.game_over) {
                    status.textContent = "It's a draw!";
                } else {
                    status.textContent = `Player ${data.current_player}'s turn`;
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function updateBoard(board) {
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            if (board[index] === 'X') {
                cell.classList.add('x');
            } else if (board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    }

    function disableBoard() {
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
    }

    async function resetGame() {
        try {
            const response = await fetch('/reset', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'winner');
                    cell.addEventListener('click', handleCellClick);
                });
                status.textContent = "Player X's turn";
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});