import { Price } from './price';

export interface Offer {
    id: number;
    title: string,
    url: string,
    photo_url: string,
    data_provider: string,
    current_price: Price,
    last_price: Price,
    error: string
}