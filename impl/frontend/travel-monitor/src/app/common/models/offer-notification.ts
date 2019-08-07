import { Offer } from './offer';

export interface OfferNotification {
    timestamp: string,
    offers_that_changed: Offer[]
}