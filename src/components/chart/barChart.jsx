// File: src/components/GroupedBarChart3.jsx
import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from "recharts";

/**
 * Grouped vertical bar chart with exactly 3 series.
 * Why: Encapsulates a common chart pattern with sensible defaults and clear props.
 */
export default function GroupedBarChart3({
    data,
    xKey = "name",
    series = [
        { key: "seriesA", label: "Series A", color: "#938E07" },
        { key: "seriesB", label: "Series B", color: "#A1A5C1" },
        { key: "seriesC", label: "Series C", color: "#234F68F7" },
        { key: "seriesD", label: "Series D", color: "#699635" },
    ],
    height = 180,
    // yLabel = "Value",
    barSize = 18,
    radius = [6, 6, 0, 0], // why: subtle rounded tops improve readability
    tooltipFormatter = ((value, name) => [value, name]),
    grid = true,
}) {
    const safeData = Array.isArray(data) && data.length
        ? data
        : [
            { [xKey]: "Week 1", seriesA: 12, seriesB: 18, seriesC: 9, seriesD: 4 },
            { [xKey]: "Week 2", seriesA: 20, seriesB: 11, seriesC: 14, seriesD: 20 },
            { [xKey]: "Week 3", seriesA: 15, seriesB: 22, seriesC: 17, seriesD: 20 },
            { [xKey]: "Week 4", seriesA: 25, seriesB: 16, seriesC: 13, seriesD: 10 },
            { [xKey]: "Week 5", seriesA: 30, seriesB: 24, seriesC: 19, seriesD: 5 },
        ];

    const formatter = tooltipFormatter

    return (
        <div className="w-full mt-6 ">

            {/* <div className="mb-2 text-sm text-gray-600">{yLabel}</div> */}
            <div className="h-[${height}px]">


                <ResponsiveContainer width="100%" height={height}>

                    {/* <Legend height={24} width={220} wrapperStyle={{ paddingBottom: 8 }} /> */}
                    <BarChart data={safeData} barCategoryGap={18} barGap={4}>
                        {grid && (
                            <CartesianGrid strokeDasharray="1.3"
                                vertical={false}
                                stroke="#99a1af"
                            />
                        )}
                        <XAxis
                            dataKey={xKey}
                            tickMargin={8}
                            axisLine={{ stroke: "#E5E7EB" }}
                            tickLine={false}
                        />
                        <YAxis
                            tickMargin={8}
                            axisLine={{ stroke: "#ffffff" }}
                            tickLine={false}
                        />
                        <Tooltip formatter={formatter} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                        {series.slice(0, 4).map((s) => (
                            <Bar
                                key={s.key}
                                dataKey={s.key}
                                name={s.label}
                                fill={s.color}
                                barSize={barSize}
                                radius={radius}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// GroupedBarChart3.propTypes = {
//     data: PropTypes.arrayOf(PropTypes.object),
//     xKey: PropTypes.string,
//     series: PropTypes.arrayOf(
//         PropTypes.shape({ key: PropTypes.string.isRequired, label: PropTypes.string, color: PropTypes.string })
//     ),
//     height: PropTypes.number,
//     yLabel: PropTypes.string,
//     barSize: PropTypes.number,
//     radius: PropTypes.array,
//     tooltipFormatter: PropTypes.func,
//     grid: PropTypes.bool,
// };

// Example usage
// import GroupedBarChart3 from "./GroupedBarChart3";
// const data = [
//   { name: "Q1", revenue: 400, profit: 240, cost: 160 },
//   { name: "Q2", revenue: 300, profit: 139, cost: 120 },
//   { name: "Q3", revenue: 200, profit: 980, cost: 390 },
//   { name: "Q4", revenue: 278, profit: 390, cost: 200 },
// ];
// <GroupedBarChart3
//   data={data}
//   xKey="name"
//   series={[
//     { key: "revenue", label: "Revenue", color: "#60A5FA" },
//     { key: "profit", label: "Profit", color: "#34D399" },
//     { key: "cost", label: "Cost", color: "#F59E0B" },
//   ]}
//   yLabel="USD (thousands)"
// />;
