export const dummyDisputes = [
    {
        id: "DISP-1001",
        contractId: "CONT-8821",
        partyFarmer: "Ramesh Kumar",
        partyBuyer: "Reliance Retail Ltd",
        category: "Payment Delay",
        status: "Open",
        priority: "High",
        createdAt: "2026-01-15T10:30:00Z",
        summary: "Final payment for wheat harvest pending for 10 days since delivery.",
        description: "I delivered 5 tons of Sonalika wheat on Jan 5th. The contract states payment within 48 hours. It has been 10 days and no payment has been received in my escrow or bank account.",
        expectedResolution: "Immediate release of pending ₹1,25,000 payment with late interest.",
        evidence: [
            { id: "ev-1", type: "image", url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200", name: "DeliveryReceipt.jpg" },
            { id: "ev-2", type: "pdf", url: "#", name: "Contract_Terms.pdf" }
        ],
        comments: [
            { id: "c-1", author: "Ramesh Kumar", role: "farmer", text: "I have already contacted the warehouse manager, but no response.", timestamp: "2026-01-15T11:00:00Z" }
        ],
        timeline: [
            { status: "Open", date: "2026-01-15T10:30:00Z", description: "Dispute raised by Farmer" }
        ]
    },
    {
        id: "DISP-1002",
        contractId: "CONT-9942",
        partyFarmer: "Suresh P.",
        partyBuyer: "ITC Agri Business",
        category: "Quality Issue",
        status: "Under Review",
        priority: "Medium",
        createdAt: "2026-01-12T14:20:00Z",
        summary: "Buyer claims moisture content is above 14%, which I dispute.",
        description: "The buyer rejected 2 tons of potatoes citing high moisture. I tested them at a local lab before dispatch and it was 11%. Requesting independent verification.",
        expectedResolution: "Acceptance of stock at agreed price.",
        evidence: [
            { id: "ev-3", type: "image", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=200", name: "Potatoes_Batch.jpg" }
        ],
        comments: [
            { id: "c-2", author: "ITC Quality Team", role: "buyer", text: "Our sensors at the collection point showed 14.5% moisture.", timestamp: "2026-01-13T09:15:00Z" },
            { id: "c-3", author: "Admin", role: "admin", text: "Assigning independent surveyor for re-testing.", timestamp: "2026-01-14T10:00:00Z" }
        ],
        timeline: [
            { status: "Open", date: "2026-01-12T14:20:00Z", description: "Dispute raised by Farmer" },
            { status: "Under Review", date: "2026-01-13T09:15:00Z", description: "Buyer responded to dispute" }
        ]
    },
    {
        id: "DISP-1003",
        contractId: "CONT-7712",
        partyFarmer: "Mahesh Singh",
        partyBuyer: "BigBasket",
        category: "Quantity Mismatch",
        status: "Resolved",
        priority: "Low",
        createdAt: "2026-01-05T09:00:00Z",
        summary: "Mismatch in sack count during unloading.",
        description: "Dispatched 100 sacks of onions, buyer reported receiving only 98 sacks.",
        expectedResolution: "Compensation for 2 missing sacks.",
        evidence: [],
        comments: [
            { id: "c-4", author: "Admin", role: "admin", text: "Warehouse logs reviewed. 2 sacks found in loading bay. Compensation approved.", timestamp: "2026-01-07T11:00:00Z" }
        ],
        timeline: [
            { status: "Open", date: "2026-01-05T09:00:00Z", description: "Dispute raised by Farmer" },
            { status: "Under Review", date: "2026-01-06T10:00:00Z", description: "Reviewing warehouse logs" },
            { status: "Resolved", date: "2026-01-07T11:00:00Z", description: "Dispute resolved by Admin" }
        ],
        resolution: {
            decision: "Approve Farmer Claim",
            notes: "CCTV confirmed 100 sacks were delivered. 2 were misplaced during unloading.",
            settlementAmount: 4500
        }
    }
];

export const dummyContracts = [
    { id: "CONT-8821", buyer: "Reliance Retail Ltd", crop: "Wheat", price: "₹2500/quintal" },
    { id: "CONT-9942", buyer: "ITC Agri Business", crop: "Potato", price: "₹1800/quintal" },
    { id: "CONT-7712", buyer: "BigBasket", crop: "Onion", price: "₹3200/quintal" },
    { id: "CONT-5541", buyer: "Zomato Hyperpure", crop: "Tomato", price: "₹1500/quintal" }
];
