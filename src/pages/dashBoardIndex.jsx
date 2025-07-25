import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from "../components/dashboardCard";


function DashBoardIndex() {
    return (
        <DashboardCard sub_title="In the last 30 days" title="Performance Metrics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-10">
                {[
                    { label: 'Total number of website visits', value: 73, color: 'bg-white text-black' },
                    { label: 'Total number of investments', value: 128, color: 'bg-white text-black' },
                    { label: 'Total number of bookings', value: 2, color: 'bg-white text-black' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        className={`rounded-xl p-5 shadow hover:shadow-lg transition ${card.color}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                        <h3 className="text-sm font-medium mb-2 text-gray-600">{card.label}</h3>
                        <p className="text-2xl font-bold">{card.value}</p>
                    </motion.div>
                ))}
            </div>
        </DashboardCard>
    )
}

export default DashBoardIndex