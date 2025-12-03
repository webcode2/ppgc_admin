export const propertyList = [
    {
        id: 1,
        name: 'Modern Studio Apartment',
        description: 'A cozy, fully-furnished studio in the city center with great amenities.',
        price: '$850 / month',
        pictures: [
            'https://via.placeholder.com/100x70?text=Studio+1',
            'https://via.placeholder.com/100x70?text=Studio+2',
        ],
    },

    {
        id: 2,
        name: 'Urban Loft',
        description: 'An industrial-style loft with open plan living space and modern finish.',
        price: '$1,200 / month',
        pictures: [
            'https://via.placeholder.com/100x70?text=Loft+1',
            'https://via.placeholder.com/100x70?text=Loft+2',
        ],
    },
    {
        id: 3,
        name: 'Beachfront Villa',
        description: 'A stunning villa with direct beach access and infinity pool.',
        price: '$3,800 / month',
        pictures: [
            'https://via.placeholder.com/100x70?text=Villa+1',
            'https://via.placeholder.com/100x70?text=Villa+2',
            'https://via.placeholder.com/100x70?text=Villa+3',
        ],
    },
];

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

// properties
export const inspectionData = [
    {
        name: 'Alice Johnson',
        property: 'Sunset Apartments - Unit 12B',
        inspectionDate: '2025-08-10',
        inspectionTime: '10:30 AM',
        callNumber: '+1 (555) 123-4567',
        // Assuming this date is in the past
        status: 'Inspected', 
    },
    {
        name: 'Michael Smith',
        property: 'Riverside Villas - Unit 7C',
        inspectionDate: '2025-08-12',
        inspectionTime: '02:00 PM',
        callNumber: '+1 (555) 987-6543',
        // Assuming this date is in the past
        status: 'Inspected', 
    },
    {
        name: 'Sara Williams',
        property: 'Greenview Condos - Unit 3A',
        inspectionDate: '2025-08-15',
        inspectionTime: '11:00 AM',
        callNumber: '+1 (555) 555-0199',
        // Assuming this date is in the past
        status: 'Inspected', 
    },
    {
        name: 'David Brown',
        property: 'Oceanfront Suites - Penthouse',
        inspectionDate: '2025-12-18', // Updated month to make it upcoming
        inspectionTime: '09:00 AM',
        callNumber: '+1 (555) 222-3333',
        // Assuming this date is in the future
        status: 'Upcoming', 
    },
    {
        name: 'Emily Davis',
        property: 'Hilltop Residences - Unit 5D',
        inspectionDate: '2025-12-20', // Updated month to make it upcoming
        inspectionTime: '03:30 PM',
        callNumber: '+1 (555) 444-7788',
        // Assuming this date is in the future
        status: 'Upcoming', 
    },
    {
        name: 'John Miller',
        property: 'Maple Heights - Unit 8F',
        inspectionDate: '2025-08-21',
        inspectionTime: '01:15 PM',
        callNumber: '+1 (555) 666-1234',
        // Assuming this date is in the past
        status: 'Inspected', 
    },
    {
        name: 'Olivia Taylor',
        property: 'Cityview Lofts - Unit 2E',
        inspectionDate: '2025-12-22', // Updated month to make it upcoming
        inspectionTime: '04:00 PM',
        callNumber: '+1 (555) 777-4321',
        // Assuming this date is in the future
        status: 'Upcoming', 
    },
    {
        name: 'James Anderson',
        property: 'Lakeside Homes - Unit 9G',
        inspectionDate: '2025-12-25', // Updated month to make it upcoming
        inspectionTime: '12:45 PM',
        callNumber: '+1 (555) 888-5678',
        // Assuming this date is in the future
        status: 'Upcoming', 
    },
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

export const invested = [
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