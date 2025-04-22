"use client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type allUsersStatsResponse,
	type currentUserStatsResponse,
	statsService,
} from "@/services/stats.service";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StatsPage() {
	const [userRecords, setUserRecords] = useState<currentUserStatsResponse>([]);
	const [allRecords, setAllRecords] = useState<allUsersStatsResponse>([]);

	useEffect(() => {
		const fetchRecords = async () => {
			try {
				// Fetch current user stats
				const { data: userData, error: userError } =
					await statsService.currentUserStats();
				if (userError) {
					throw userError;
				}
				setUserRecords(userData.data);

				// Fetch all users stats
				const { data: allData, error: allError } =
					await statsService.allUsersStats();
				if (allError) {
					throw allError;
				}
				setAllRecords(allData.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchRecords();
	}, []);
	// Function to render a table with records
	const renderRecordsTable = (
		records: currentUserStatsResponse | allUsersStatsResponse,
		showUserName = false,
	) => {
		return (
			<div className="overflow-hidden border rounded-lg shadow-sm">
				<Table>
					<TableHeader className="bg-muted text-muted-foreground">
						<TableRow>
							{showUserName && <TableHead>用户名</TableHead>}
							<TableHead className="w-[100px]">网格大小</TableHead>
							<TableHead>时长（秒）</TableHead>
							<TableHead>创建时间</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{records?.map((record) => (
							<TableRow key={record.id}>
								{showUserName && (
									<TableCell>
										{"userName" in record ? record.userName || "-" : "-"}
									</TableCell>
								)}
								<TableCell className="font-medium">{record.gridSize}</TableCell>
								<TableCell>{(record.duration / 1000).toFixed(2)}</TableCell>
								<TableCell>
									{new Date(record.createdAt).toLocaleString("zh-CN", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
									})}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-4 relative min-h-screen p-4">
			<Header showControls={true} />
			<div className="mt-12 max-w-2xl mx-auto w-full">
				<div className="mb-4">
					<Button variant="outline" asChild>
						<Link href="/">
							<IconArrowLeft />
							返回首页
						</Link>
					</Button>
				</div>

				<Tabs defaultValue="self" className="w-full">
					<TabsList className="mb-4 w-full justify-start">
						<TabsTrigger value="self">个人统计</TabsTrigger>
						<TabsTrigger value="all">全部统计</TabsTrigger>
					</TabsList>
					<TabsContent value="self">
						{renderRecordsTable(userRecords, false)}
					</TabsContent>
					<TabsContent value="all">
						{renderRecordsTable(allRecords, true)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
