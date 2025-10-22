// File: src/components/WaveLikeChart.jsx
import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

/**
 * Smooth wave-like chart with gradient fill.
 * Why: Visualizes trends with a flowing, organic style.
 */
export default function WaveLikeChart({
    data,
    xKey = "name",
    yKey = "value",
    color = "#938E07",
    height = 160,
    tooltipFormatter = ((value, name) => [value, name]),
    grid = true,
}) {
    const safeData =
        Array.isArray(data) && data.length
            ? data
            : [
                { name: "Jan", value: 40 },
                { name: "Feb", value: 80 },
                { name: "Mar", value: 50 },
                { name: "Apr", value: 90 },
                { name: "May", value: 60 },
                { name: "Jun", value: 100 },
            ];

    const formatter = tooltipFormatter

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={safeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    {grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                    <XAxis
                        dataKey={xKey}
                        axisLine={{ stroke: "#ffffff" }}
                        tickLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        axisLine={{ stroke: "#ffffff" }}
                        tickLine={false}
                        tickMargin={8}
                    />
                    <Tooltip formatter={formatter} />
                    <defs>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey={yKey}
                        stroke={color}
                        fill="url(#waveGradient)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );

}
// Example usage:
// import WaveLikeChart from "./WaveLikeChart";
// const chartData = [
//   { name: "Mon", value: 20 },
//   { name: "Tue", value: 35 },
//   { name: "Wed", value: 50 },
//   { name: "Thu", value: 30 },
//   { name: "Fri", value: 70 },
// ];
// <WaveLikeChart data={chartData} color="#10B981" />;
