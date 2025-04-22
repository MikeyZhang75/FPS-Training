"use client";

import { AuthDialog } from "@/components/AuthDialog";
import { LanguageDialog } from "@/components/LanguageDialog";
import { UserProfileButton } from "@/components/UserProfileButton";
import { Button } from "@/components/ui/button";
import { FadeTransition } from "@/components/ui/fade-transition";
import { useLoginContext } from "@/contexts/LoginContext";
import { useLanguage } from "@/hooks/useLanguage";
import { IconLanguage } from "@tabler/icons-react";

interface HeaderProps {
	showControls?: boolean;
}

export function Header({ showControls = true }: HeaderProps) {
	const { language, isDialogOpen, openDialog, closeDialog, changeLanguage } =
		useLanguage();

	const { isDialogOpen: isLoginDialogOpen, closeDialog: closeLoginDialog } =
		useLoginContext();

	return (
		<>
			<FadeTransition
				show={showControls}
				className="absolute top-4 right-4 h-9"
			>
				<div className="flex gap-2">
					<Button size="icon" variant="outline" onClick={openDialog}>
						<IconLanguage />
					</Button>
					<UserProfileButton />
				</div>
			</FadeTransition>

			<LanguageDialog
				isOpen={isDialogOpen}
				onClose={closeDialog}
				selectedLanguage={language}
				onSelectLanguage={changeLanguage}
			/>

			<AuthDialog isOpen={isLoginDialogOpen} onClose={closeLoginDialog} />
		</>
	);
}
