import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from "../components/dashboardCard";
import GroupedBarChart3 from "../components/chart/barChart";
import { ChartNoAxesCombined, HouseIcon, Image, UsersIcon } from "lucide-react";
import DoughnutChart4 from "../components/chart/doughnut";
import WaveLikeChart from "../components/chart/smoothGraph";


function DashBoardIndex() {
    return (
        <div className="wrapper w-full  space-y-5">
            <div className="min-w-full">
                <DashboardCard sub_title="In the last 30 days" title="Performance Metrics" >
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
                                    icon: <HouseIcon size={18} className="text-[#938E07]" />,
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
                                    icon: <HouseIcon />,
                                    labelUp: 'Total Daily Pay Users', valueUp: 2, labelDOwn: 'Total Amount Saved', valueDown: "150k",
                                }
                            },


                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                className={`rounded-xl p-4 border border-[#938E07] transition ${card.color}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            ><div className="flex gap-x-2 items-center text-[#938E07]">

                                    {card.data.icon}
                                    <p className="text-lg font-bold text-gray-800">{card.title}</p>
                                </div>
                                <div className="flex mt-2 gap-3">

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
                <div className="col-span-8">
                    <DashboardCard className="py-0 pt-10 px-5" title="Properties Insight">
                        <GroupedBarChart3 />
                    </DashboardCard>
                </div>

                {/* Right side — tall card spanning 2 rows */}
                <div className="col-span-4 row-span-2">
                    <DashboardCard className="" s title="Booking Summary" >
                        <DoughnutChart4 />                    </DashboardCard>
                </div>

                {/* Left side — bottom row */}
                <div className="col-span-8">
                    <DashboardCard title="Investment" className="px-5 ">
                        <WaveLikeChart />
                    </DashboardCard>
                </div>
            </div>

        </div>

    )
}

export default DashBoardIndex