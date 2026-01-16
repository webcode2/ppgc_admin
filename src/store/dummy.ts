import { ReadInvestmentItem } from "../utils/types/investment";
import { InspectionItem } from "../utils/types/propertyInspection";


//  for avaiable rooms under bookingPage
export const rooms = [
    { roomNo: 101, price: 42000, status: "reserved" },
    { roomNo: 102, price: 45000, status: "available" },
    { roomNo: 103, price: 90, status: "reserved" },
    { roomNo: 104, price: 200, status: "available" },
    { roomNo: 105, price: 175000, status: "reserved" },
    { roomNo: 106, price: 130, status: "available" },
    { roomNo: 107, price: 160, status: "reserved" },
    { roomNo: 108, price: 140, status: "available" },
    { roomNo: 109, price: 180, status: "reserved" },
    { roomNo: 110, price: 100, status: "available" },
];



// notification

export const notificationsData = [
    {
        id: 1,
        name: "Jane Doe",
        room: 12,
        hotel: "Kings Hotel",
        startDate: "May 10, 2025",
        endDate: "May 14, 2025",
        dateSent: "May 9, 2025",
        timeSent: "10:00am",
        isUnread: true,
        group: "Today",
    },
    {
        id: 2,
        name: "Jane Doe",
        room: 12,
        hotel: "Kings Hotel",
        startDate: "May 10, 2025",
        endDate: "May 14, 2025",
        dateSent: "May 9, 2025",
        timeSent: "10:00am",
        isUnread: false,
        group: "Yesterday",
    },
];


// investments

export const invested: ReadInvestmentItem[]= [
    {
        name: "Jane Doe",
        category: "Land banking",
        package: "2% monthly",
        amount: 40000.0,
        roi: 800.0,
        investmentDate: "30-04-2025",
        maturityDate: "30-05-2025",
    },
    {
        name: "Jane Doe",
        category: "Land banking",
        package: "2% monthly",
        amount: 40000.0,
        roi: 800.0,
        investmentDate: "30-04-2025",
        maturityDate: "30-05-2025",
    },
    {
        name: "Mery Doe",
        category: "Land banking",
        package: "2% monthly",
        amount: 40000.0,
        roi: 800.0,
        investmentDate: "30-04-2025",
        maturityDate: "30-05-2025",
    },
];