"use client";

import { useState, useEffect, useCallback } from "react";

type GridSize = 4 | 5 | 6;

export default function Home() {
	const [gridSize, setGridSize] = useState<GridSize>(4);
	const [numbers, setNumbers] = useState<number[]>([]);
	const [nextNumber, setNextNumber] = useState(1);
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [timer, setTimer] = useState(0);
	const [buttonColors, setButtonColors] = useState<string[]>([]);

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
		// Generate diverse colors by distributing hues evenly around the color wheel
		const generateDiverseColors = (count: number) => {
			const colors = [];
			// Divide the color wheel (360 degrees) into equal segments
			const hueStep = 360 / count;

			for (let i = 0; i < count; i++) {
				// Base hue for this segment
				const baseHue = Math.floor(i * hueStep);
				// Add a small random offset within the segment for variety
				const hue = baseHue + Math.floor(Math.random() * (hueStep * 0.8));
				// Medium-low saturation (20-50%)
				const s = Math.floor(Math.random() * 30) + 20;
				// High lightness (75-90%) for readability with black text
				const l = Math.floor(Math.random() * 15) + 75;
				colors.push(`hsl(${hue}, ${s}%, ${l}%)`);
			}

			// Shuffle the colors to avoid predictable patterns
			return colors.sort(() => Math.random() - 0.5);
		};

		setNumbers(shuffleNumbers());
		setNextNumber(1);
		setGameOver(false);
		setGameStarted(false);
		setTimer(0);

		// Generate diverse colors for each button
		const totalNumbers = gridSize * gridSize;
		setButtonColors(generateDiverseColors(totalNumbers));
	}, [shuffleNumbers, gridSize]);

	// Start the game
	const startGame = useCallback(() => {
		if (!gameStarted && !gameOver) {
			setGameStarted(true);
		}
	}, [gameStarted, gameOver]);

	// Change grid size
	const handleGridSizeChange = (size: GridSize) => {
		if (gameStarted) {
			const confirmChange = window.confirm(
				"Changing grid size will reset the current game. Continue?",
			);
			if (!confirmChange) return;
		}
		setGridSize(size);
		resetGame();
	};

	// Shuffle the numbers when the component mounts
	useEffect(() => {
		resetGame();
	}, [resetGame]);

	// Timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (gameStarted && !gameOver) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer + 1);
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [gameStarted, gameOver]);

	// Format time as MM:SS
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Handle box click
	const handleBoxClick = (num: number) => {
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
	};

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 bg-black select-none"
			onKeyDown={() => {}}
		>
			{(!gameStarted || gameOver) && (
				<div
					className="absolute top-4 left-4"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
				>
					<select
						className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={gridSize}
						onChange={(e) =>
							handleGridSizeChange(Number(e.target.value) as GridSize)
						}
					>
						<option value={4}>4×4</option>
						<option value={5}>5×5</option>
						<option value={6}>6×6</option>
					</select>
				</div>
			)}

			<div className="relative">
				<div className="absolute -top-10 left-0 right-0 text-center">
					<div className="inline-block px-4 py-2 rounded-md shadow-md text-white">
						<span className="text-xl font-mono font-bold">
							{formatTime(timer)}
						</span>
					</div>
				</div>

				<div
					className="grid gap-2 p-4 rounded-lg shadow-lg relative grid-cols-[repeat(var(--grid-size),minmax(0,1fr))] grid-rows-[repeat(var(--grid-size),minmax(0,1fr))]"
					style={
						{
							"--grid-size": gridSize,
						} as React.CSSProperties
					}
				>
					{numbers.map((num, index) => (
						<button
							key={`number-${num}`}
							type="button"
							className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg sm:text-xl font-bold rounded-md cursor-pointer text-black
								${num < nextNumber && gameStarted ? "opacity-40" : "hover:brightness-95"}`}
							style={{ backgroundColor: buttonColors[index] }}
							onClick={() => handleBoxClick(num)}
							disabled={(!gameStarted && num !== 1) || gameOver}
						>
							{num}
						</button>
					))}
				</div>

				{gameOver && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
						<div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
							<p className="text-xl font-bold mb-4">游戏结束！</p>
							<button
								type="button"
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
								onClick={(e) => {
									e.stopPropagation();
									resetGame();
								}}
							>
								再玩一次
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
