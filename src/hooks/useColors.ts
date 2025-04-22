import { useCallback } from "react";

export const useColors = () => {
	// Generate diverse colors for buttons by distributing hues
	const generateDiverseColors = useCallback((count: number) => {
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
	}, []);

	return {
		generateDiverseColors,
	};
};
