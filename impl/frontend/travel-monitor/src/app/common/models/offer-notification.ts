import { Offer } from './offer';

export interface OfferNotification {
    timestamp: string,
    updated: Offer[],
}