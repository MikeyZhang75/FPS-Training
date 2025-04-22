import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLoginContext } from "@/contexts/LoginContext";
import { signOut, useSession } from "@/lib/auth-client";
import { IconLogout, IconUser } from "@tabler/icons-react";

export function UserProfileButton() {
	const { openDialog } = useLoginContext();
	const session = useSession();
	const isAuthenticated = !!session.data?.user;

	// If the user is not authenticated, show the login/register button
	if (!isAuthenticated) {
		return <Button onClick={openDialog}>登录 / 注册</Button>;
	}

	// If the user is authenticated, show their name/email and a dropdown menu
	const user = session.data?.user;
	const displayName = user?.name || user?.email || "用户";

	const handleLogout = async () => {
		// Use the signOut function from better-auth
		await signOut();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<IconUser />
					<span className="max-w-[120px] truncate">{displayName}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>我的账户</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<IconLogout />
					退出登录
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
