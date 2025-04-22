"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FadeTransition } from "@/components/ui/fade-transition";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type GridSize, useGame } from "@/hooks/useGame";
import { motion } from "framer-motion";

// Helper function to resume AudioContext on user interaction
const resumeAudioContext = () => {
	// This will resume any suspended AudioContext when the user interacts with the page
	const AudioContextClass = window.AudioContext;
	if (AudioContextClass) {
		// Get all existing audio contexts
		const audioContexts: AudioContext[] = [];

		// Try to access the global audio context we created in useSound.ts
		// We'll use a safer approach without relying on a global list
		const ctx = (window as { __audioContext?: AudioContext }).__audioContext;
		if (ctx) {
			audioContexts.push(ctx);
		}

		// Resume all contexts
		for (const ctx of audioContexts) {
			if (ctx.state === "suspended") {
				ctx
					.resume()
					.catch((error: Error) =>
						console.error("Failed to resume AudioContext:", error),
					);
			}
		}
	}

	// Remove the event listeners after first interaction
	window.removeEventListener("click", resumeAudioContext);
	window.removeEventListener("touchstart", resumeAudioContext);
	window.removeEventListener("keydown", resumeAudioContext);
};

// Add event listeners for user interaction
if (typeof window !== "undefined") {
	window.addEventListener("click", resumeAudioContext);
	window.addEventListener("touchstart", resumeAudioContext);
	window.addEventListener("keydown", resumeAudioContext);
}

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
			className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 select-none"
			onKeyDown={() => {}}
		>
			{/* With Framer Motion, we can simplify the structure */}
			<FadeTransition
				show={!gameStarted || gameOver}
				className="absolute top-4 left-4 h-9 w-[180px]"
			>
				<div
					className="w-full h-full"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
				>
					<Select
						onValueChange={(value) =>
							handleGridSizeChange(Number(value) as GridSize)
						}
						value={gridSize.toString()}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Grid Size" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="4">4×4</SelectItem>
							<SelectItem value="5">5×5</SelectItem>
							<SelectItem value="6">6×6</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</FadeTransition>

			<Header showControls={!gameStarted || gameOver} />

			<div className="relative">
				<div className="text-center">
					<motion.div
						className="inline-block px-4 py-2 bg-black dark:bg-background text-white dark:text-foreground rounded-md"
						animate={{
							scale: 1,
							boxShadow:
								"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
						}}
						transition={{
							duration: 0.3,
						}}
					>
						<span className="text-xl font-mono font-bold">
							{formatTime(timer)}
						</span>
					</motion.div>
				</div>

				<motion.div
					key={`grid-${gridSize}`}
					className="grid gap-2 p-4 rounded-lg shadow-lg relative grid-cols-[repeat(var(--grid-size),minmax(0,1fr))] grid-rows-[repeat(var(--grid-size),minmax(0,1fr))]"
					style={
						{
							"--grid-size": gridSize,
						} as React.CSSProperties
					}
					// Enable layout animations
					layout
					// Add initial animation for the grid container to prevent layout shift
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					// Add a transition for smooth animation and to prevent layout shift
					transition={{
						duration: 0.5,
						type: "spring",
						stiffness: 300,
						damping: 30,
					}}
				>
					{numbers.map((num, index) => (
						<motion.div
							key={`number-${num}-${gridSize}`}
							layout="position"
							initial={{ opacity: 0, scale: 1 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={
								(!gameStarted && num === 1) || !gameStarted || gameOver
									? { scale: 1.05 }
									: undefined
							}
							whileTap={
								(!gameStarted && num === 1) || !gameStarted || gameOver
									? { scale: 0.95 }
									: undefined
							}
							transition={{ duration: 0.4, delay: index * 0.03 }}
						>
							<div
								className={`w-full h-full ${num < nextNumber && gameStarted ? "opacity-40" : ""}`}
							>
								<Button
									type="button"
									className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg sm:text-xl font-bold cursor-pointer text-black hover:brightness-95"
									style={{ backgroundColor: buttonColors[index] }}
									onClick={() => handleBoxClick(num)}
									disabled={(!gameStarted && num !== 1) || gameOver}
								>
									{!gameStarted && num !== 1 ? "?" : num}
								</Button>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* For the game over overlay, we use AnimatePresence for proper mounting/unmounting */}
				<FadeTransition
					show={gameOver}
					preventLayoutShift={false}
					className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
				>
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
				</FadeTransition>
			</div>
		</div>
	);
}
