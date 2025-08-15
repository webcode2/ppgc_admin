import { OutlineButton } from "../buttons";

export default function PendingLiquidateInvestments({ data = [] }) {


    return (
        <div className="bg-white   overflow-hidden mt-8">


            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 font-bold">Name</th>
                            <th className="py-3 px-4 font-bold">Amount</th>
                            <th className="py-3 px-4 font-bold">Interest Lost</th>
                            <th className="py-3 px-4 font-bold">Payment Date</th>
                            <th className="py-3 px-4 font-bold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-4 px-4">{item.name}</td>
                                <td className="py-4 px-4">{item.category}</td>
                                <td className="py-4 px-4">{item.package}</td>
                                <td className="py-4 px-4">
                                    {item.amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </td>
                                <td className="py-4 px-4">
                                    <OutlineButton>Approved</OutlineButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
