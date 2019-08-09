import { Offer } from 'src/app/common/models/offer';

export class OfferWrapper {

    public offer: Offer;
    public isLoading: boolean;

    public constructor(offer: Offer, isLoading=false) {
        this.offer = offer;
        this.isLoading = isLoading;
    }
}
