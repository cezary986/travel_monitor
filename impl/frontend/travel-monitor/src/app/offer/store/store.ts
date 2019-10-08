import {
    SET_OFFERS_INIT_STATE,
    SET_OFFERS_LIST,
    ADD_OFFER,
    UPDATE_OFFER,
    DELETE_OFFER
} from './actions';
import { Offer } from 'src/app/common/models/offer';
import { Action } from 'src/app/store';

export interface IOffersState {
    offers: {};
}

export const OFFERS_INIT_STATE: IOffersState = {
    offers: null,
};

function setOffersList(state: IOffersState, action: Action<Offer[]>): IOffersState {
    const offersHashArray = {};
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < action.payload.length; i++) {
        const element: Offer = action.payload[i];
        offersHashArray[element.id] = element;
    }
    return {
        ...state,
        offers: offersHashArray,
    };
}

function addOffer(state: IOffersState, action: Action<Offer>): IOffersState {
    const newState = {...state};
    const offer: Offer = action.payload;
    newState.offers[offer.id] = offer;
    return newState;
}

function deleteOffer(state: IOffersState, action: Action<Offer>): IOffersState {
    const newState = {...state};
    const offer: Offer = action.payload;
    delete newState.offers[offer.id];
    return newState;
}


export function offersReducer(state: IOffersState = OFFERS_INIT_STATE, action): IOffersState {
    switch (action.type) {
        case SET_OFFERS_INIT_STATE: return state = OFFERS_INIT_STATE;
        case SET_OFFERS_LIST: return setOffersList(state, action);
        case ADD_OFFER: return addOffer(state, action);
        case UPDATE_OFFER: return addOffer(state, action);
        case DELETE_OFFER: return deleteOffer(state, action);

    }
    return state;
}
