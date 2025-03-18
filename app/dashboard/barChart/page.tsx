'use client';

import { CartesianGrid, Bar, BarChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GET_instalasi_dataCategory } from "@/app/api/database";
import { useState, useEffect } from "react";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Instalasi_DataCategory } from "@/app/interface";

// Define available color schemes
const colorSchemes: Record<string, string[]> = {
    default: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "#800080", "#008080", "#FF6347", "#4682B4"],
    blues: ["#0074D9", "#7FDBFF", "#001f3f", "#39CCCC", "#85144b", "#3D9970"],
    greens: ["#2ECC40", "#01FF70", "#3D9970", "#FFDC00", "#FF851B", "#FF4136"]
};

// Custom legend component
const CustomChartLegend = ({ payload }: { payload?: { value: string; color: string }[] }) => {
    if (!payload) return null;

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
                gap: 40,
                flexWrap: 'wrap',
                padding: '0 16px'
            }}
        >
            {payload.map((entry, index) => (
                <div
                    key={`legend-item-${index}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '15px'
                    }}
                >
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            backgroundColor: entry.color,
                            marginRight: 8
                        }}
                    />
                    <span>{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function Page() {
    const colorScheme = "default"
    const [category, serCategory] = useState("Complain");
    const [instalasi, setInstalasi] = useState("A");
    const [data, setData] = useState<Instalasi_DataCategory[]>([]);
    const [chartData, setChartData] = useState<Instalasi_DataCategory[]>([]);
    const [dataKeys, setDataKeys] = useState<string[]>([]);
    const [chartConfig, setChartConfig] = useState<Record<string, { label: string; color: string }>>({});
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
    });

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = (await GET_instalasi_dataCategory(category, instalasi, dateRange.from, dateRange.to)) || [];
            setData(fetchedData);
        };
        fetchData();
    }, [category, instalasi, dateRange]);

    useEffect(() => {
        if (!data || data.length === 0) return;

        console.log("data", data);
        // Convert dates to consistent format
        const dataWithUTC = data.map((item) => ({
            ...item,
            date: new Date(item.date).toISOString().split("T")[0] // Convert to YYYY-MM-DD
        }));

        // Extract valid data keys
        const firstItem = dataWithUTC[0] as Instalasi_DataCategory;
        const extractedKeys = Object.keys(firstItem).filter(key =>
            key !== 'date' && key !== '_id' && typeof firstItem[key as keyof Instalasi_DataCategory] === 'number'
        );

        setDataKeys(extractedKeys);
        setChartData(dataWithUTC);

        // Ensure the selected color scheme exists
        const colors = colorSchemes[colorScheme] || colorSchemes.default;
        const newChartConfig: Record<string, { label: string; color: string }> = {};

        extractedKeys.forEach((key, index) => {
            newChartConfig[key] = {
                label: key,
                color: colors[index % colors.length]
            };
        });

        setChartConfig(newChartConfig);
    }, [data, colorScheme]);



    const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
        setDateRange({ from, to });
        // Filter table data based on selected date range
        //table.getColumn("date")?.setFilterValue([from, to]);
        const deltaInMillis = to.getDate() - from.getDate();


        console.log("from", from);
        console.log("to", to);
        console.log("delta in days:", deltaInMillis);
    };

    const filteredData = chartData.filter((item) => {
        console.log("chartData", chartData);
        const date = new Date(item.date);
        const { from, to } = dateRange;
        // return date >= startDate && date <= referenceDate;
        return date >= from && date <= to;
    });

    return (
        <div className="flex flex-col w-screen h-screen p-2 items-center">
            <div className="flex items-center justify-between bg-blue-500 rounded-lg ml-5 mr-5 mt-3 w-full">
                <SidebarTrigger className="ml-1 text-white" />
                <h1 className="text-center font-bold text-white text-2xl flex-grow">
                    HALAMAN BAR CHART
                </h1>
            </div>

            <Card className="m-5">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle>Data Category tiap Instalasi</CardTitle>
                        <CardDescription>menunjukkan data category tiap ruangan dalam satu instalasi</CardDescription>

                    </div>

                    {/* Range Waktu */}
                    <CalendarDatePicker
                        date={dateRange}
                        onDateSelect={handleDateSelect}
                        className="h-9 w-[250px]"
                        variant="outline"
                    />
                    {/* kategori */}
                    <Select value={category} onValueChange={serCategory}>
                        <SelectTrigger className="w-52 rounded-lg sm:ml-auto" aria-label="Select a time range">
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="Complain" className="rounded-lg">
                                Complain
                            </SelectItem>
                            <SelectItem value="Fasilitas" className="rounded-lg">
                                Fasilitas
                            </SelectItem>
                            <SelectItem value="Pasien4hari" className="rounded-lg">
                                Pasien lebih dari 4 hari
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Instalasi */}
                    <Select value={instalasi} onValueChange={setInstalasi}>
                        <SelectTrigger className="w-40 rounded-lg sm:ml-auto" aria-label="Select a time range">
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="A" className="rounded-lg">
                                Instalasi A
                            </SelectItem>
                            <SelectItem value="B" className="rounded-lg">
                                Instalasi B
                            </SelectItem>
                            <SelectItem value="C" className="rounded-lg">
                                Instalasi C
                            </SelectItem>
                        </SelectContent>
                    </Select>



                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    {dataKeys.length > 0 && (
                        <ChartContainer config={chartConfig} className="aspect-auto h-96 w-full">
                            <BarChart
                                accessibilityLayer
                                data={filteredData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                                {dataKeys.length > 0 &&
                                    dataKeys.map((key, index) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            fill={colorSchemes[colorScheme]?.[index % colorSchemes[colorScheme]?.length] || "#000"}
                                            radius={4}
                                        />
                                    ))}

                                <ChartLegend
                                    content={
                                        <CustomChartLegend
                                            payload={dataKeys.map((key, index) => ({
                                                value: key,
                                                color: colorSchemes[colorScheme]?.[index % colorSchemes[colorScheme]?.length] || "#000"
                                            }))}
                                        />
                                    }
                                />
                            </BarChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
