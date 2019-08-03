import { Offer } from './offer';

export interface Travel {
    id: number;
    title: string,
    offers: Offer[],
    creater: string,
    created_by: string,
    refreshed: string
}