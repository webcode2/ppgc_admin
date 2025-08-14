// File: src/components/DoughnutChart4.jsx
import React from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

/**
 * Doughnut chart with exactly 4 partitions.
 * Why: Encapsulates a common chart pattern with consistent colors and structure.
 */
export default function DoughnutChart4({
    data,
    series = [
        { key: "seriesA", label: "Comfirmed", color: "#938E07" },
        { key: "seriesB", label: "Pending", color: "#F9F10CCC" },
        { key: "seriesC", label: "Canceled", color: "#234F68F7" },
        { key: "seriesD", label: "Completed", color: "#699635" },
    ],
    height = 300,
    innerRadius = "60%",
    outerRadius = "100%",
    tooltipFormatter,
}) {
    // Provide default data if none passed
    const safeData =
        Array.isArray(data) && data.length
            ? data
            : [
                { name: "Comfirmed", value: 25 },
                { name: "Pending", value: 35 },
                { name: "Canceled", value: 20 },
                { name: "Completed", value: 20 },
            ];

    const formatter =
        tooltipFormatter || ((value, name) => [`${value}`, name]);

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={safeData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={0}
                    >
                        {series.map((s, idx) => (
                            <Cell key={s.key} fill={s.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={formatter} />
                    {/* <Legend verticalAlign="bottom" height={36} width={150} /> */}
                </PieChart>
            </ResponsiveContainer>
            <div className="legend space-y-3">
                {series.map((legend) => {
                    return (
                        <div key={legend.key} className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: legend.color }}
                            ></div>
                            <p>{legend.label} Bookings</p>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

// Example usage
// import DoughnutChart4 from "./DoughnutChart4";
// const chartData = [
//   { name: "Series A", value: 25 },
//   { name: "Series B", value: 35 },
//   { name: "Series C", value: 20 },
//   { name: "Series D", value: 20 },
// ];
// <DoughnutChart4 data={chartData} />;
