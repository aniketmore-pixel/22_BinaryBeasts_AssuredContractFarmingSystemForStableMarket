/**
 * Firestore Collections Schema
 */

export const COLLECTIONS = {
    USERS: 'users',
    CONTRACTS: 'contracts',
    OFFERS: 'offers',
    DISPUTES: 'disputes',
    PAYMENTS: 'payments',
    PROGRESS_UPDATES: 'progressUpdates'
};

/**
 * Schema Definitions:
 * 
 * users: {
 *   uid: string,
 *   email: string,
 *   displayName: string,
 *   role: 'farmer' | 'buyer' | 'admin',
 *   kycStatus: 'pending' | 'verified' | 'rejected',
 *   trustScore: number (0-100),
 *   phone: string,
 *   farmDetails: { location: string, size: string, crops: string[] } (for farmers),
 *   companyDetails: { name: string, gst: string } (for buyers)
 * }
 * 
 * contracts: {
 *   id: string,
 *   buyerId: string,
 *   farmerId: string,
 *   offerId: string,
 *   crop: string,
 *   quantity: number,
 *   pricePerUnit: number,
 *   status: 'draft' | 'negotiation' | 'active' | 'delivery_pending' | 'delivered' | 'paid' | 'closed',
 *   signedAt: timestamp,
 *   deliveryDate: timestamp,
 *   escrowLocked: boolean
 * }
 * 
 * offers: {
 *   id: string,
 *   creatorId: string,
 *   crop: string,
 *   expectedQuantity: number,
 *   offeredPrice: number,
 *   marketPrice: number,
 *   location: string,
 *   deadline: timestamp
 * }
 */
