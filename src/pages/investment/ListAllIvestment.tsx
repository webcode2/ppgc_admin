import { ChartNoAxesCombined, ChartNoAxesCombinedIcon, HouseIcon, Image, PiggyBankIcon, UsersIcon, Wallet } from "lucide-react"
import DashboardCard from "../../components/dashboardCard"
import { motion, AnimatePresence } from 'framer-motion';
import InvestmentsTable from "../../components/investments/investmentTable";
import PendingLiquidateInvestments from "../../components/investments/ActiveInvestment";
import { useNavigate } from "react-router-dom";
import FloatingAddButton from "../../components/AddFloatingButton";
import { invested } from "../../store/dummy";



function InvestmentScreen() {
    const navigate =useNavigate()


    return (
        <div className="space-y-6  px-5">
            <div className="relative overflow-hidden rounded-2xl">
                <DashboardCard sub_title="In the last 30 days" title="Investment Overview" className="pb-0 overflow-hidden " showDropDown={false} >
                    <motion.div
                        className={`border-[#938E07] transition `}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 * 0.1 }}
                    > <div
                        className="absolute -top-10 -right-40 w-[500px] h-[500px] z-0 opacity-30 rotate-6 x"
                        style={{
                            background: "linear-gradient(13deg, #F9F10C 0%, #938E07 100%)",
                            clipPath:
                                "polygon(67% 0%, 100% 37%, 79% 100%, 24% 100%, 0% 40%, 36% 0%)",
                        }}
                    ></div></motion.div>


                    <div className="grid z-30 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 mb-10">
                        {[



                            {
                                title: "Total Investment", data: {
                                    icon: <ChartNoAxesCombinedIcon className="text-[#938E07]" />,
                                    labelUp: 'Total Investments', valueUp: 10,
                                }
                            },

                            {
                                title: "Land Banking", data: {
                                    icon: <Image />,
                                    labelUp: 'Total of land banking category', valueUp: 15,
                                }
                            },

                            {
                                title: "Property Bank", data: {
                                    icon: <PiggyBankIcon />,
                                    labelUp: 'Total number of property investment', valueUp: 2,
                                }
                            },


                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                className={`rounded-xl p-4 border border-[#938E07] transition `}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            ><div className="flex gap-x-2 items-center text-[#938E07]">

                                    {card.data.icon}
                                    <p className="text-lg font-bold text-gray-800">{card.title}</p>
                                </div>
                                <div className="flex mt-2 gap-3 justify-between">

                                    <h3 className="text-xs font-medium mb-2 text-gray-600 whitespace-break-spacess">{card.data.labelUp}</h3>
                                    <p className="text-2xl font-bold">{card.data.valueUp}</p>
                                </div>
                                {/* <div className="flex gap-x-3 mt-2 justify-between items-center">

                                    <h3 className="text-xs font-medium mb-2 text-gray-600 whitespace-break-spacess">{card.data.labelDOwn}</h3>
                                    <p className="text-2xl font-bold">{card.data.valueDown}</p>
                                </div> */}
                            </motion.div>
                        ))}
                    </div>



                </DashboardCard>
            </div>

            <DashboardCard  dropDownData={[]} title="Investment" showDropDown={false} extraView={invested.length > 2} viewAllAction={() => { alert("fetch more invested data") }}>
                <InvestmentsTable data={invested} />
            </DashboardCard>

            <DashboardCard title="Pending Liquidatiion" showDropDown={false} extraView={invested.length > 2} viewAllAction={() => { alert("fetch more pending liquidation ") }}>
                <PendingLiquidateInvestments data={invested} />
            </DashboardCard>
  <FloatingAddButton className="   bg-transparent border-[#7f7a06] border rounded-full text-[#7f7a06] active:scale-95 transition-all" onClick={() => {
                navigate("/investments/new")
            }} />
        </div >
    )
}

export default InvestmentScreen