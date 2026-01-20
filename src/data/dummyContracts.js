export const dummyContracts = [
    {
        id: "CONT-8821",
        buyer: "Reliance Retail Ltd",
        partner: "Reliance Retail Ltd",
        farmer: "Ramesh Kumar",
        farmerName: "Ramesh Kumar",
        crop: "Wheat",
        status: "active",
        startDate: "2026-01-01",
        endDate: "2026-04-15",
        value: 65000,
        milestones: [
            { id: "m1", type: "Payment", title: "Advance Payment", date: "2026-01-02", dueDate: "2026-01-02", paidDate: "2026-01-02", status: "PAID", amount: 25000, currency: "₹" },
            { id: "m2", type: "Delivery", title: "Initial Harvest Delivery", date: "2026-03-25", dueDate: "2026-03-25", status: "PENDING", amount: 0, currency: "₹" },
            { id: "m3", type: "Payment", title: "Mid-term Processing", date: "2026-02-15", dueDate: "2026-02-15", status: "PENDING", amount: 40000, currency: "₹" },
            { id: "m4", type: "Delivery", title: "Final Batch Delivery", date: "2026-04-10", dueDate: "2026-04-10", status: "PENDING", amount: 0, currency: "₹" }
        ]
    },
    {
        id: "CONT-9942",
        buyer: "ITC Agri Business",
        partner: "ITC Agri Business",
        farmer: "Suresh P.",
        farmerName: "Suresh P.",
        crop: "Potato",
        status: "active",
        startDate: "2026-01-10",
        endDate: "2026-05-20",
        value: 15000,
        milestones: [
            { id: "m5", type: "Contract", title: "Contract Signing", date: "2026-01-10", dueDate: "2026-01-10", paidDate: "2026-01-10", status: "PAID", amount: 0, currency: "₹" },
            { id: "m6", type: "Delivery", title: "Quality Inspection", date: "2026-01-25", dueDate: "2026-01-25", status: "LOCKED", amount: 0, currency: "₹" },
            { id: "m7", type: "Payment", title: "Quality Bonus", date: "2026-02-01", dueDate: "2026-02-01", status: "PENDING", amount: 15000, currency: "₹" }
        ]
    },
    {
        id: "CONT-5541",
        buyer: "Zomato Hyperpure",
        partner: "Zomato Hyperpure",
        farmer: "Mahesh Singh",
        farmerName: "Mahesh Singh",
        crop: "Tomato",
        status: "pending",
        startDate: "2026-02-01",
        endDate: "2026-06-01",
        value: 50000,
        milestones: [
            { id: "m8", type: "Contract", title: "Verification Visit", date: "2026-02-05", dueDate: "2026-02-05", status: "PENDING", amount: 0, currency: "₹" }
        ]
    }
];
