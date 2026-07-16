# Tic-Tac-Toe Game

A simple, modern Tic-Tac-Toe web game featuring local and dual-difficulty AI game modes, real-time scoreboards, and smooth animations.

## Technical Specifications
* **Core:** Semantic HTML5, Vanilla CSS3, Javascript (ES6+)
* **Typography:** Outfit (Google Fonts)
* **Assets:** Custom SVG vector scoreboard elements and victory overlay line indicators

## Key Features
* **Selectable Game Modes:**
  * 👥 **vs Friend:** Local two-player pass-and-play.
  * 🤖 **vs AI (Easy):** Casual mode against a randomized AI picker.
  * 🧠 **vs AI (Hard):** Competitive mode containing smart block-and-win logic.
* **Neobrutalist Styling & Effects:** Features bold typography, high-contrast borders, active neon border indicator highlights, cell pop-in animations, and a classic animated SVG vector line that draws itself across winning grid cells.
* **Scoreboard:** Tracks rounds won with custom SVG icons (X / O) and includes a dedicated **Reset Scores** button.
* **Ghost AI Timeout Protection:** Prevent out-of-order moves or duplicate turns if a game mode is modified or a new round is triggered rapidly mid-AI turn.
* **Responsive Layout:** Automatically scales elements down for mobile screen sizes (down to 320px wide) and switches from a three-column desktop grid to a mobile stacked grid.

## Usage Instructions

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. **Open the Game:**
   Open the `index.html` file directly in any web browser to start playing (or run a local server like `npx http-server -p 8080` in the directory).

### Playing the Game
1. **Choose Game Mode:** Select your game mode under the **Game Mode** panel. *Note: Swapping game modes will reset current scores.*
2. **Make Moves:** Click on empty cells inside the 3x3 grid to claim your slot.
3. **Score Tracking:** Wins automatically increment the scores in the **Players** card.
4. **New Round:** Click the **New Round** button at the bottom of the board to clear the grid cells and SVG victory indicators for the next round.
5. **Reset Scores:** Click the **Reset Scores** button inside the Players card to clear the score counts back to zero.
