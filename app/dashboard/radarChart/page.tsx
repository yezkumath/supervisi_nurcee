"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Legend } from "recharts"
import { GET_fullCategory } from "@/app/api/database"
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar";
import { dataRadarChart } from "@/app/interface";
import { LegendProps } from "recharts";

// Updated chart config to match your data categories
const chartConfig = {
    Complain: {
        label: "Complain",
        color: "hsl(var(--chart-1))",
    },
    Fasilitas: {
        label: "Fasilitas",
        color: "hsl(var(--chart-2))",
    },
    Pasien4hari: {
        label: "Pasien>4hari",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

export default function Page() {
    const [data, setData] = useState<dataRadarChart[]>([]);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
    });

    useEffect(() => {
        console.log(dateRange.from);
        console.log(dateRange.to);

        const fetchData = async () => {
            const fetchedData = await GET_fullCategory(dateRange.from, dateRange.to) || [];
            console.log(fetchedData);
            setData(fetchedData);
        };
        fetchData();
    }, [dateRange]);

    const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
        setDateRange({ from, to });
    };

    // Calculate date range for display in footer
    const getDateRangeText = () => {
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);

        const fromMonth = from.toLocaleString('default', { month: 'long' });
        const toMonth = to.toLocaleString('default', { month: 'long' });
        const fromYear = from.getFullYear();
        const toYear = to.getFullYear();

        if (fromYear === toYear && fromMonth === toMonth) {
            return `${fromMonth} ${fromYear}`;
        } else if (fromYear === toYear) {
            return `${fromMonth} - ${toMonth} ${fromYear}`;
        } else {
            return `${fromMonth} ${fromYear} - ${toMonth} ${toYear}`;
        }
    };

    // Custom legend component
    const renderLegendText: LegendProps["formatter"] = (value, entry) => {
        if (!entry || typeof entry !== "object") return value;

        const color = (entry as { color?: string }).color ?? "black";

        return (
            <span style={{ color, fontSize: "14px", fontWeight: 500, padding: "0 8px" }}>
                {value}
            </span>
        );
    };

    return (
        <div className="w-screen h-screen p-2 flex flex-col items-center">
            <div className="flex items-center justify-between bg-blue-500 rounded-lg ml-5 mr-5 mt-3 w-full">
                <SidebarTrigger className="ml-1 text-white" />
                <h1 className="text-center font-bold text-white text-2xl flex-grow">
                    HALAMAN RADAR CHART
                </h1>
            </div>
            <Card className="m-5">
                <CardHeader className="items-center pb-4">
                    <CardTitle>Ruangan Category Analysis</CardTitle>
                    <CardDescription>
                        Menampilkan semua data kategori di setiap ruangan di RS Elisabeth Semarang
                    </CardDescription>
                    <CalendarDatePicker
                        date={dateRange}
                        onDateSelect={handleDateSelect}
                        className="h-9 w-[250px]"
                        variant="outline"
                    />
                </CardHeader>
                <CardContent className="w-full">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[500px] w-full"
                    >
                        <RadarChart data={data}>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <PolarAngleAxis dataKey="nama_ruangan" />
                            <PolarGrid radialLines={false} />
                            <Radar
                                name="Complain"
                                dataKey="Complain"
                                fill="var(--color-Complain)"
                                fillOpacity={0}
                                stroke="var(--color-Complain)"
                                strokeWidth={2}
                            />
                            <Radar
                                name="Fasilitas"
                                dataKey="Fasilitas"
                                fill="var(--color-Fasilitas)"
                                fillOpacity={0}
                                stroke="var(--color-Fasilitas)"
                                strokeWidth={2}
                            />
                            <Radar
                                name="Pasien > 4hari"
                                dataKey="Pasien4hari"
                                fill="var(--color-Pasien4hari)"
                                fillOpacity={0}
                                stroke="var(--color-Pasien4hari)"
                                strokeWidth={2}
                            />
                            <Legend
                                iconSize={12}
                                formatter={renderLegendText}
                                wrapperStyle={{
                                    marginTop: '25px',  // Increased top margin here
                                    paddingTop: '15px',
                                    paddingBottom: '5px'
                                }}
                                verticalAlign="bottom"
                                align="center"
                                layout="horizontal"
                            />
                        </RadarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        {data.length > 0 ? `Menampilkan data dari ${data.length} Rauang Rawat Inap` : "Data tidak tersedia"}
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                        {getDateRangeText()}
                    </div>
                </CardFooter>
            </Card>

        </div>

    )
}