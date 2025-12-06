import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from "../components/dashboardCard";
import GroupedBarChart3 from "../components/chart/barChart";
import { ChartNoAxesCombined, HouseIcon, Image, UsersIcon, Wallet } from "lucide-react";
import DoughnutChart4 from "../components/chart/doughnut";
import WaveLikeChart from "../components/chart/smoothGraph";
import ChoiceDropdown from "../components/chart/chartDropDown";


function DashBoardIndex() {
    const allServices = [
        { key: "seriesA", label: "Self Contains", color: "#938E07" },
        { key: "seriesB", label: "Hotels", color: "#A1A5C1" },
        { key: "seriesC", label: "Apartments", color: "#234F68F7" },
        { key: "seriesD", label: "Real Estates", color: "#699635" },


    ]
    const data = [
        { "name": "Week 1", seriesA: 12, seriesB: 18, seriesC: 9, seriesD: 4 },
        { "name": "Week 2", seriesA: 20, seriesB: 11, seriesC: 14, seriesD: 20 },
        { "name": "Week 3", seriesA: 15, seriesB: 22, seriesC: 17, seriesD: 20 },
        { "name": "Week 4", seriesA: 25, seriesB: 16, seriesC: 13, seriesD: 10 },
        { "name": "Week 5", seriesA: 30, seriesB: 24, seriesC: 19, seriesD: 5 },
    ]

    return (
        <div className="wrapper w-full  space-y-5 p-5">
            <div className="min-w-full">
                <DashboardCard sub_title="In the last 30 days" title="Performance Metrics" className="pb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-5 mb-10">
                        {[
                            {
                                title: "User",
                                data: {
                                    icon: <UsersIcon />,
                                    labelUp: 'Total number of website visits', valueUp: 73,
                                    labelDOwn: 'App Downloads', valueDown: 500,
                                }
                            },

                            {
                                title: "Investment",
                                data: {
                                    icon: <ChartNoAxesCombined />,
                                    labelUp: 'Total number of investments', valueUp: 128, labelDOwn: 'Amount invested', valueDown: "800k",
                                }
                            },



                            {
                                title: "Hotel", data: {
                                    icon: <HouseIcon className="text-[#938E07]" />,
                                    labelUp: 'Total number of bookings', valueUp: 2, labelDOwn: 'Total Rooms Available', valueDown: "30",
                                }
                            },

                            {
                                title: "Properties", data: {
                                    icon: <Image />,
                                    labelUp: 'Total Properties Sold', valueUp: 73, labelDOwn: 'Total Properties Available', valueDown: "30",
                                }
                            },

                            {
                                title: "Savings", data: {
                                    icon: <Wallet />,
                                    labelUp: 'Total Daily Pay Users', valueUp: 2, labelDOwn: 'Total Amount Saved', valueDown: "150k",
                                }
                            },


                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                className={`rounded-xl p-4 border border-[#938E07] transition`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <div className="flex gap-x-2 items-center text-[#938E07]">

                                    {card.data.icon}
                                    <p className="text-lg font-bold text-gray-800">{card.title}</p>
                                </div>
                                <div className="flex mt-2 gap-3 justify-between">

                                    <h3 className="text-xs font-medium mb-2 text-gray-600 whitespace-break-spacess">{card.data.labelUp}</h3>
                                    <p className="text-2xl font-bold">{card.data.valueUp}</p>
                                </div>
                                <div className="flex gap-x-3 mt-2 justify-between items-center">

                                    <h3 className="text-xs font-medium mb-2 text-gray-600 whitespace-break-spacess">{card.data.labelDOwn}</h3>
                                    <p className="text-2xl font-bold">{card.data.valueDown}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </DashboardCard>
            </div>

            <div className="w-full grid grid-cols-12 gap-5">
                {/* Left side — top row */}
                <div className="col-span-9">
                    <DashboardCard className="pb-4 pt-10 px-5" title="" showHeader={false}>
                        <div className="header flex justify-between">

                            <div className="title min-w-4/12"><p className="text-lg font-bold">Properties Insight</p></div>
                            <div className="legend  flex gap-x-4 w-7/12">
                                <ChoiceDropdown />
                                <div className="grid grid-cols-2 gap-3">
                                    {allServices.map((legend) => {
                                        return (
                                            <div key={legend.key} className="flex items-center gap-2">
                                                <div
                                                    className="w-5 h-5 rounded"
                                                    style={{ backgroundColor: legend.color }}
                                                ></div>
                                                <p>{legend.label} </p>
                                            </div>
                                        );
                                    })
                                    }
                                </div>
                            </div>
                        </div>


                        <GroupedBarChart3 data={data} series={allServices} />
                    </DashboardCard>
                </div>

                {/* Right side — tall card spanning 2 rows */}
                <div className="col-span-3 row-span-2">
                    <DashboardCard className=" px-5 " showHeader={false} >
                        <div className="header flex justify-between items-start pb-5">

                            <div className="title min-w-6/12"><p className="text-lg font-bold">Bookings Summery</p></div>

                        </div>
                        <DoughnutChart4 data={[
                            { name: "Comfirmed", value: 25 },
                            { name: "Pending", value: 35 },
                            { name: "Canceled", value: 20 },
                            { name: "Completed", value: 20 },
                        ]} />
                    </DashboardCard>
                </div>

                {/* Left side — bottom row */}
                <div className="col-span-9">
                    <DashboardCard title="" className="px-5 py-5 " showHeader={false}>
                        <div className="header flex justify-between items-start pb-5">

                            <div className="title min-w-4/12"><p className="text-lg font-bold">Investments</p></div>
                            <div className="legend  flex gap-x-4 w-7/12 justify-end">
                                <ChoiceDropdown />

                            </div>
                        </div>

                        <WaveLikeChart data={[
                            { name: "Jan", value: 40 },
                            { name: "Feb", value: 80 },
                            { name: "Mar", value: 50 },
                            { name: "Apr", value: 90 },
                            { name: "May", value: 60 },
                            { name: "Jun", value: 100 },
                        ]} />
                    </DashboardCard>
                </div>
            </div>

        </div>

    )
}

export default DashBoardIndex