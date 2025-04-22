"use client";

import { useGame } from "@/hooks/useGame";

export default function Home() {
	const {
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
	} = useGame();

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
							handleGridSizeChange(Number(e.target.value) as 4 | 5 | 6)
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
