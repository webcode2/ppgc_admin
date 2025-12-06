import React from "react";
import { ReadInvestmentItem } from "../../utils/types/investment";


interface InvestmentsTableProps {
    data?: ReadInvestmentItem[];
}

export default function InvestmentsTable({ data = [] }: InvestmentsTableProps) {
    return (
        <div className="bg-white overflow-hidden mt-8">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 font-bold">Name</th>
                            <th className="py-3 px-4 font-bold">Category</th>
                            <th className="py-3 px-4 font-bold">Package</th>
                            <th className="py-3 px-4 font-bold">Amount</th>
                            <th className="py-3 px-4 font-bold">ROI</th>
                            <th className="py-3 px-4 font-bold">Investment Date</th>
                            <th className="py-3 px-4 font-bold">Maturity Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-200 hover:bg-gray-100"
                            >
                                <td className="py-4 px-4">{item.name}</td>
                                <td className="py-4 px-4">{item.category}</td>
                                <td className="py-4 px-4">{item.package}</td>
                                <td className="py-4 px-4">
                                    {item.amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </td>
                                <td className="py-4 px-4">
                                    {item.roi.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </td>
                                <td className="py-4 px-4">{item.investmentDate}</td>
                                <td className="py-4 px-4">{item.maturityDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
