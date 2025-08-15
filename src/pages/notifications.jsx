import React, { useState } from "react";
import { User } from "lucide-react";
import { notificationsData } from "../store/dummy";
import DashboardCard from "../components/dashboardCard";



export default function NotificationUI() {
    const [tab, setTab] = useState("All");

    const filtered =
        tab === "Unread" ? notificationsData.filter((n) => n.isUnread) : notificationsData;

    const grouped = filtered.reduce((acc, notif) => {
        acc[notif.group] = acc[notif.group] || [];
        acc[notif.group].push(notif);
        return acc;
    }, {});

    return (
        <DashboardCard showDropDown={false} title="Notification">           {/* Tabs */}
            <div className="flex gap-4 border-b pb-2 mt-4 mb-4">
                {['All', 'Unread'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`pb-1 border-b-2 text-sm font-medium transition-colors duration-200 ${tab === t
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Groups */}
            {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-6">
                    <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2">
                        {group}
                    </h2>
                    <div className="space-y-3">
                        {items.map((n) => (
                            <div
                                key={n.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p
                                        className={`text-sm ${n.isUnread ? 'font-semibold' : 'text-gray-700'}`}
                                    >
                                        {n.name} booked room {n.room} at {n.hotel} from {n.startDate} to {n.endDate}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {n.dateSent} | {n.timeSent}
                                    </p>
                                </div>
                                {n.isUnread && (
                                    <div className="flex-shrink-0 mt-2">
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full block"></span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </DashboardCard>
    );
}
