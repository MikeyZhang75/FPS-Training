import { useSession } from "@/lib/auth-client";
import { recordService } from "@/services/record.service";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useColors } from "./useColors";
import { useSound } from "./useSound";
import { useTimer } from "./useTimer";
export type GridSize = 4 | 5 | 6;

export const useGame = (initialGridSize: GridSize = 4) => {
	const [gridSize, setGridSize] = useState<GridSize>(initialGridSize);
	const [numbers, setNumbers] = useState<number[]>([]);
	const [nextNumber, setNextNumber] = useState(1);
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [buttonColors, setButtonColors] = useState<string[]>([]);
	const startTimeRef = useRef<number | null>(null);

	const { generateDiverseColors } = useColors();
	const { playSound } = useSound();
	const timerIsRunning = gameStarted && !gameOver;
	const { timer, resetTimer, formatTime } = useTimer(timerIsRunning);

	const session = useSession();
	const user = session.data?.user;

	// Save game record to database
	const saveGameRecord = useCallback(
		async (gridSize: GridSize, startTime: number, endTime: number) => {
			// Show loading toast
			const toastId = toast.loading("保存游戏记录...");

			try {
				// Call record service to save the record
				const { error } = await recordService.create({
					gridSize,
					startTime: String(startTime),
					endTime: String(endTime),
				});

				if (error) {
					throw error.value.message;
				}

				// Update toast to success
				toast.success("游戏记录已保存", {
					id: toastId,
				});
			} catch (error) {
				// Handle any errors
				toast.error("保存游戏记录时出错", {
					id: toastId,
				});
				console.error("Error saving record:", error);
			}
		},
		[],
	);

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
		// First update all state variables
		setNumbers(shuffleNumbers());
		setNextNumber(1);
		setGameOver(false);
		setGameStarted(false);
		resetTimer();
		startTimeRef.current = null;

		// Generate diverse colors for each button
		const totalNumbers = gridSize * gridSize;
		setButtonColors(generateDiverseColors(totalNumbers));
	}, [shuffleNumbers, generateDiverseColors, gridSize, resetTimer]);

	// Start the game
	const startGame = useCallback(() => {
		if (!gameStarted && !gameOver) {
			setGameStarted(true);
			startTimeRef.current = Date.now(); // Unix timestamp in milliseconds
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
				// Play sound for correct click in a non-blocking way
				void playSound("/sounds/click.wav");
				return;
			}

			// Return if game not active or over
			if (gameOver || !gameStarted) return;

			if (num === nextNumber) {
				// Correct number clicked
				// Play sound for correct click in a non-blocking way
				void playSound("/sounds/click.wav");

				// Update game state immediately without waiting for sound to finish
				// This prevents additional clicks during transition and double-clicks
				if (nextNumber === gridSize * gridSize) {
					// Game completed successfully
					setGameOver(true);

					// Log game timing information
					const endTime = Date.now();
					if (startTimeRef.current) {
						const startTime = startTimeRef.current;
						// Save record to database
						if (user) {
							saveGameRecord(gridSize, startTime, endTime);
						}
					}
				} else {
					setNextNumber(nextNumber + 1);
				}
			} else {
				// Incorrect number clicked - game over
				setGameOver(true);
			}
		},
		[
			gameOver,
			gameStarted,
			nextNumber,
			gridSize,
			startGame,
			playSound,
			saveGameRecord,
			user,
		],
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
