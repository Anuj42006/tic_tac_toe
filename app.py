from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Initialize the game board
board = ['' for _ in range(9)]
current_player = 'X'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/make_move', methods=['POST'])
def make_move():
    global current_player, board
    
    position = int(request.json['position'])
    
    if board[position] == '':
        board[position] = current_player
        
        # Check for winner
        winner = check_winner()
        
        # Switch player
        current_player = 'O' if current_player == 'X' else 'X'
        
        return jsonify({
            'success': True,
            'board': board,
            'winner': winner,
            'current_player': current_player,
            'game_over': winner is not None or '' not in board
        })
    
    return jsonify({'success': False})

@app.route('/reset', methods=['POST'])
def reset():
    global board, current_player
    board = ['' for _ in range(9)]
    current_player = 'X'
    return jsonify({'success': True, 'board': board})

def check_winner():
    # Winning combinations
    win_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]              # Diagonals
    ]
    
    for combo in win_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] != '':
            return board[combo[0]]
    
    return None

if __name__ == '__main__':
    app.run(debug=True)