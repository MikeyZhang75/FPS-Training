"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface FadeTransitionProps {
	show: boolean;
	children: React.ReactNode;
	className?: string;
	duration?: number; // Duration in milliseconds
	preventLayoutShift?: boolean; // Whether to keep the element in the DOM to prevent layout shift
}

export function FadeTransition({
	show,
	children,
	className,
	duration = 0.5, // Framer Motion uses seconds instead of milliseconds
	preventLayoutShift = true, // Default to preventing layout shift
}: FadeTransitionProps) {
	// If we're preventing layout shift, we'll use layout animations
	if (preventLayoutShift) {
		return (
			<motion.div
				className={cn(className)}
				animate={{ opacity: show ? 1 : 0 }}
				transition={{ duration }}
				// This makes the element take up space even when invisible
				style={{ visibility: show ? "visible" : "hidden" }}
				aria-hidden={!show}
			>
				{children}
			</motion.div>
		);
	}

	// If we don't need to prevent layout shift, we can use AnimatePresence
	// to properly mount/unmount the component
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					className={cn(className)}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
