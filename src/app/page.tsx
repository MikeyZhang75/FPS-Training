"use client";

import { AuthDialog } from "@/components/AuthDialog";
import { LanguageDialog } from "@/components/LanguageDialog";
import { UserProfileButton } from "@/components/UserProfileButton";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLoginContext } from "@/contexts/LoginContext";
import { type GridSize, useGame } from "@/hooks/useGame";
import { useLanguage } from "@/hooks/useLanguage";
import { IconLanguage } from "@tabler/icons-react";

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

	const { language, isDialogOpen, openDialog, closeDialog, changeLanguage } =
		useLanguage();

	const { isDialogOpen: isLoginDialogOpen, closeDialog: closeLoginDialog } =
		useLoginContext();

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 select-none"
			onKeyDown={() => {}}
		>
			{(!gameStarted || gameOver) && (
				<div
					className="absolute top-4 left-4"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
				>
					<Select
						onValueChange={(value) =>
							handleGridSizeChange(Number(value) as GridSize)
						}
						value={gridSize.toString()}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Grid Size" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="4">4×4</SelectItem>
							<SelectItem value="5">5×5</SelectItem>
							<SelectItem value="6">6×6</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}

			<div className="absolute top-4 right-4 flex gap-2">
				<Button size="icon" variant="outline" onClick={openDialog}>
					<IconLanguage />
				</Button>
				<UserProfileButton />
			</div>

			<LanguageDialog
				isOpen={isDialogOpen}
				onClose={closeDialog}
				selectedLanguage={language}
				onSelectLanguage={changeLanguage}
			/>

			<AuthDialog isOpen={isLoginDialogOpen} onClose={closeLoginDialog} />

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
						<Button
							key={`number-${num}`}
							type="button"
							className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg sm:text-xl font-bold cursor-pointer text-black
								${num < nextNumber && gameStarted ? "opacity-40" : "hover:brightness-95"}`}
							style={{ backgroundColor: buttonColors[index] }}
							onClick={() => handleBoxClick(num)}
							disabled={(!gameStarted && num !== 1) || gameOver}
						>
							{!gameStarted && num !== 1 ? "?" : num}
						</Button>
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
