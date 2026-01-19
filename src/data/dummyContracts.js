export const dummyContracts = [
    {
        id: "CONT-8821",
        buyer: "Reliance Retail Ltd",
        farmer: "Ramesh Kumar",
        crop: "Wheat",
        status: "Active",
        startDate: "2026-01-01",
        endDate: "2026-04-15",
        milestones: [
            { id: "m1", type: "Payment", title: "Advance Payment", date: "2026-01-02", status: "Completed", amount: "₹25,000" },
            { id: "m2", type: "Delivery", title: "Initial Harvest Delivery", date: "2026-03-25", status: "Upcoming" },
            { id: "m3", type: "Payment", title: "Mid-term Processing", date: "2026-02-15", status: "Upcoming", amount: "₹40,000" },
            { id: "m4", type: "Delivery", title: "Final Batch Delivery", date: "2026-04-10", status: "Upcoming" }
        ]
    },
    {
        id: "CONT-9942",
        buyer: "ITC Agri Business",
        farmer: "Suresh P.",
        crop: "Potato",
        status: "Active",
        startDate: "2026-01-10",
        endDate: "2026-05-20",
        milestones: [
            { id: "m5", type: "Contract", title: "Contract Signing", date: "2026-01-10", status: "Completed" },
            { id: "m6", type: "Delivery", title: "Quality Inspection", date: "2026-01-25", status: "Today" },
            { id: "m7", type: "Payment", title: "Quality Bonus", date: "2026-02-01", status: "Upcoming", amount: "₹15,000" }
        ]
    },
    {
        id: "CONT-5541",
        buyer: "Zomato Hyperpure",
        farmer: "Mahesh Singh",
        crop: "Tomato",
        status: "Pending",
        startDate: "2026-02-01",
        endDate: "2026-06-01",
        milestones: [
            { id: "m8", type: "Contract", title: "Verification Visit", date: "2026-02-05", status: "Upcoming" }
        ]
    }
];
