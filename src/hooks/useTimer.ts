import { useCallback, useEffect, useState } from "react";

export const useTimer = (isRunning: boolean) => {
	const [timer, setTimer] = useState(0);

	// Reset timer to zero
	const resetTimer = useCallback(() => {
		setTimer(0);
	}, []);

	// Format time as MM:SS
	const formatTime = useCallback((seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}, []);

	// Timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRunning) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer + 1);
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning]);

	return {
		timer,
		resetTimer,
		formatTime,
	};
};
