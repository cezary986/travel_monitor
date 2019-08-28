import { Offer } from './offer';

export interface OfferComment {
    id: number,
    timestamp: string,
    edited: string,
    created: string,
    content: string,
    offer: Offer,
}