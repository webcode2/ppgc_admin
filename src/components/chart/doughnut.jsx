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
        { key: "seriesA", label: "Hotel", color: "#938E07" },
        { key: "seriesB", label: "Booking", color: "#F9F10CCC" },
        { key: "seriesC", label: "Series C", color: "#234F68F7" },
        { key: "seriesD", label: "Series D", color: "#699635" },
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
                { name: "Series A", value: 25 },
                { name: "Series B", value: 35 },
                { name: "Series C", value: 20 },
                { name: "Series D", value: 20 },
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
                    <Legend verticalAlign="bottom" height={36} width={150} />
                </PieChart>
            </ResponsiveContainer>
            <div className="legend">
                {series.map(legend => (
                    <div className=""></div>
                ))}
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
