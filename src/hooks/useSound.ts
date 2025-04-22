import { useCallback, useEffect, useRef } from "react";

// Create a global audio context outside of the component to be reused
// This is more efficient than creating a new Audio element each time
let audioContext: AudioContext | null = null;

// Initialize the audio context lazily (only when needed)
const getAudioContext = (): AudioContext => {
	if (!audioContext) {
		// Create audio context only when needed (on first sound play)
		// This avoids the "The AudioContext was not allowed to start" error
		// Handle browser compatibility
		const AudioContextClass = window.AudioContext;
		audioContext = new AudioContextClass();

		// Store the audio context on the window object so it can be accessed
		// by the resumeAudioContext function in page.tsx
		if (typeof window !== "undefined") {
			(window as { __audioContext?: AudioContext }).__audioContext =
				audioContext;
		}
	}

	// We know audioContext is not null here
	return audioContext as AudioContext;
};

// Cache for loaded audio buffers
const audioBufferCache: { [key: string]: AudioBuffer } = {};

// Function to load audio file and decode it to an AudioBuffer
const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
	// Return from cache if already loaded
	if (audioBufferCache[url]) {
		return audioBufferCache[url];
	}

	try {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await getAudioContext().decodeAudioData(arrayBuffer);

		// Cache the decoded buffer
		audioBufferCache[url] = audioBuffer;
		return audioBuffer;
	} catch (error) {
		console.error("Error loading audio buffer:", error);
		throw error;
	}
};

export const useSound = () => {
	const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
	const isLoadingRef = useRef<{ [key: string]: boolean }>({});
	// Add a timestamp to track when a sound was last played
	const lastPlayedRef = useRef<{ [key: string]: number }>({});

	// Clean up function to release audio resources
	useEffect(() => {
		return () => {
			// Stop all playing sounds
			for (const node of sourceNodesRef.current) {
				try {
					node.stop();
					node.disconnect();
				} catch {
					// Ignore errors from already stopped nodes
				}
			}
			sourceNodesRef.current = [];
		};
	}, []);

	// Function to play a sound without blocking the main thread
	const playSound = useCallback(async (soundPath: string) => {
		try {
			// Get current time to check throttling
			const now = Date.now();
			const lastPlayed = lastPlayedRef.current[soundPath] || 0;

			// Prevent playing the same sound more than once every 50ms
			// This prevents issues with multiple rapid calls
			if (now - lastPlayed < 50) {
				return;
			}

			// Update last played timestamp
			lastPlayedRef.current[soundPath] = now;

			// If the sound is currently loading, don't try to load it again
			// But we still update the timestamp to prevent throttling issues
			if (isLoadingRef.current[soundPath]) {
				return;
			}

			// Mark as loading
			isLoadingRef.current[soundPath] = true;

			// Load the audio buffer (from cache if available)
			const audioBuffer = await loadAudioBuffer(soundPath);

			// Create a new source node for this playback
			const context = getAudioContext();

			// Check if the context is in suspended state (happens after inactivity)
			if (context.state === "suspended") {
				await context.resume();
			}

			const source = context.createBufferSource();
			source.buffer = audioBuffer;
			source.connect(context.destination);

			// Keep track of the source node for cleanup
			sourceNodesRef.current.push(source);

			// Start playback immediately
			source.start(0);

			// Remove the source node from our tracking array when it finishes
			source.onended = () => {
				sourceNodesRef.current = sourceNodesRef.current.filter(
					(node) => node !== source,
				);
			};

			// Clear loading state after a short delay to prevent rapid re-triggering
			setTimeout(() => {
				isLoadingRef.current[soundPath] = false;
			}, 100);
		} catch (error) {
			console.error("Error playing sound:", error);
			isLoadingRef.current[soundPath] = false;
		}
	}, []);

	return { playSound };
};
