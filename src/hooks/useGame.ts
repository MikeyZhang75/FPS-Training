import { useCallback, useEffect, useState } from "react";
import { useColors } from "./useColors";
import { useTimer } from "./useTimer";

type GridSize = 4 | 5 | 6;

export const useGame = (initialGridSize: GridSize = 4) => {
	const [gridSize, setGridSize] = useState<GridSize>(initialGridSize);
	const [numbers, setNumbers] = useState<number[]>([]);
	const [nextNumber, setNextNumber] = useState(1);
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [buttonColors, setButtonColors] = useState<string[]>([]);

	const { generateDiverseColors } = useColors();
	const timerIsRunning = gameStarted && !gameOver;
	const { timer, resetTimer, formatTime } = useTimer(timerIsRunning);

	// Function to shuffle the numbers array
	const shuffleNumbers = useCallback(() => {
		const totalNumbers = gridSize * gridSize;
		const nums = Array.from({ length: totalNumbers }, (_, i) => i + 1);
		for (let i = nums.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[nums[i], nums[j]] = [nums[j], nums[i]];
		}
		return nums;
	}, [gridSize]);

	// Reset the game
	const resetGame = useCallback(() => {
		setNumbers(shuffleNumbers());
		setNextNumber(1);
		setGameOver(false);
		setGameStarted(false);
		resetTimer();

		// Generate diverse colors for each button
		const totalNumbers = gridSize * gridSize;
		setButtonColors(generateDiverseColors(totalNumbers));
	}, [shuffleNumbers, generateDiverseColors, gridSize, resetTimer]);

	// Start the game
	const startGame = useCallback(() => {
		if (!gameStarted && !gameOver) {
			setGameStarted(true);
		}
	}, [gameStarted, gameOver]);

	// Change grid size
	const handleGridSizeChange = useCallback(
		(size: GridSize) => {
			if (gameStarted) {
				const confirmChange = window.confirm(
					"Changing grid size will reset the current game. Continue?",
				);
				if (!confirmChange) return;
			}
			setGridSize(size);
			resetGame();
		},
		[gameStarted, resetGame],
	);

	// Handle box click
	const handleBoxClick = useCallback(
		(num: number) => {
			// If game not started and clicked on 1, start the game
			if (!gameStarted && !gameOver && num === 1) {
				startGame();
				setNextNumber(2); // Move to next number since 1 was clicked
				return;
			}

			// Return if game not active or over
			if (gameOver || !gameStarted) return;

			if (num === nextNumber) {
				// Correct number clicked
				if (nextNumber === gridSize * gridSize) {
					// Game completed
					alert("Congratulations! You completed the sequence!");
					resetGame();
				} else {
					setNextNumber(nextNumber + 1);
				}
			} else {
				// Incorrect number clicked - game over
				setGameOver(true);
			}
		},
		[gameOver, gameStarted, nextNumber, resetGame, gridSize, startGame],
	);

	// Setup initial game state
	useEffect(() => {
		resetGame();
	}, [resetGame]);

	return {
		gridSize,
		numbers,
		nextNumber,
		gameOver,
		gameStarted,
		timer,
		buttonColors,
		handleGridSizeChange,
		handleBoxClick,
		resetGame,
		formatTime,
	};
};
