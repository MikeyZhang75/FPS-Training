import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { LANGUAGE_OPTIONS, type Language } from "@/hooks/useLanguage";
import { IconCheck } from "@tabler/icons-react";
import { IconWorld } from "@tabler/icons-react";

interface LanguageDialogProps {
	isOpen: boolean;
	onClose: () => void;
	selectedLanguage: Language;
	onSelectLanguage: (language: Language) => void;
}

export function LanguageDialog({
	isOpen,
	onClose,
	selectedLanguage,
	onSelectLanguage,
}: LanguageDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<IconWorld size={20} />
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-2 py-4">
					{LANGUAGE_OPTIONS.map((option) => (
						<Button
							key={option.value}
							variant="outline"
							className="justify-between"
							onClick={() => onSelectLanguage(option.value)}
						>
							<span>{option.label}</span>
							{selectedLanguage === option.value && (
								<IconCheck size={16} className="text-primary" />
							)}
						</Button>
					))}
				</div>
				<DialogClose asChild>
					<Button variant="outline" className="w-full">
						Cancel
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
