import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = (isRunning: boolean) => {
	const [timer, setTimer] = useState(0);
	const startTimeRef = useRef(0);
	const requestIdRef = useRef<number | null>(null);

	// Reset timer to zero
	const resetTimer = useCallback(() => {
		setTimer(0);
		startTimeRef.current = 0;
	}, []);

	// Format time as SS:MS with exact precision
	const formatTime = useCallback((seconds: number): string => {
		const secs = Math.floor(seconds);
		// Get exact milliseconds (0-99)
		const ms = Math.floor((seconds - secs) * 100) % 100;
		return `${secs.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
	}, []);

	// Timer effect using requestAnimationFrame for precise timing
	useEffect(() => {
		const updateTimer = () => {
			if (startTimeRef.current === 0) {
				startTimeRef.current = performance.now();
			}

			const elapsedSeconds = (performance.now() - startTimeRef.current) / 1000;
			setTimer(elapsedSeconds);

			requestIdRef.current = requestAnimationFrame(updateTimer);
		};

		if (isRunning) {
			requestIdRef.current = requestAnimationFrame(updateTimer);
		} else if (!isRunning && startTimeRef.current !== 0) {
			// Pause the timer by storing the current elapsed time
			setTimer((prevTimer) => prevTimer);
		}

		return () => {
			if (requestIdRef.current) {
				cancelAnimationFrame(requestIdRef.current);
			}
		};
	}, [isRunning]);

	return {
		timer,
		resetTimer,
		formatTime,
	};
};
