"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { GridSize } from "@/hooks/useGame";

interface GameOverDialogProps {
	open: boolean;
	timer: number;
	gridSize: GridSize;
	formatTime: (time: number) => string;
	resetGame: () => void;
}

export function GameOverDialog({
	open,
	timer,
	gridSize,
	formatTime,
	resetGame,
}: GameOverDialogProps) {
	return (
		<Dialog open={open} onOpenChange={(open) => !open && resetGame()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold text-center">
						游戏结束！
					</DialogTitle>
				</DialogHeader>

				<div className="my-4 space-y-2 text-center">
					<p className="text-lg">
						你的时间:{" "}
						<span className="font-mono font-bold">{formatTime(timer)}</span>
					</p>
					<p className="text-sm text-muted-foreground">
						网格大小: {gridSize}×{gridSize}
					</p>
				</div>

				<DialogFooter className="sm:justify-center">
					<Button
						type="button"
						className="w-full sm:w-auto"
						onClick={resetGame}
					>
						再玩一次
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
