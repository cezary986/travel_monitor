import {
    SET_OFFERS_INIT_STATE,
    SET_OFFERS_LIST,
    ADD_OFFER,
    UPDATE_OFFER,
    DELETE_OFFER,
    SET_OFFERS_TRAVEL,
    SET_OFFERS_TRAVEL_USERS,
    ADD_TRAVEL_USER,
    REMOVE_TRAVEL_USER
} from './actions';
import { Offer } from 'src/app/common/models/offer';
import { Action } from 'src/app/store';
import { Travel } from 'src/app/common/models/travel';
import { User } from 'src/app/common/models/user';

export interface IOffersState {
    offers: {};
    travelData: {
        travel: Travel;
        users: User[];
    };
}

export const OFFERS_INIT_STATE: IOffersState = {
    offers: null,
    travelData: {
        travel: null,
        users: null
    }
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

function setOffersTravel(state: IOffersState, action: Action<Travel>): IOffersState {
    return {
        ...state,
        travelData: {
            ...state.travelData,
            travel: action.payload
        }
    };
}

function setOffersTravelUsers(state: IOffersState, action: Action<User[]>): IOffersState {
    return {
        ...state,
        travelData: {
            ...state.travelData,
            users: action.payload
        }
    };
}

function addOffersTravelUser(state: IOffersState, action: Action<User>): IOffersState {
    const tmp = [...state.travelData.users];
    tmp.push(action.payload);
    return {
        ...state,
        travelData: {
            ...state.travelData,
            users: tmp
        }
    };
}

function removeOffersTravelUser(state: IOffersState, action: Action<User>): IOffersState {
    const tmp = [...state.travelData.users];
    const index = tmp.findIndex((el) => {
        return el.id === action.payload.id;
    });
    tmp.splice(index, 1);
    return {
        ...state,
        travelData: {
            ...state.travelData,
            users: tmp
        }
    };
}

export function offersReducer(state: IOffersState = OFFERS_INIT_STATE, action): IOffersState {
    switch (action.type) {
        case SET_OFFERS_INIT_STATE: return state = OFFERS_INIT_STATE;
        case SET_OFFERS_LIST: return setOffersList(state, action);
        case ADD_OFFER: return addOffer(state, action);
        case UPDATE_OFFER: return addOffer(state, action);
        case DELETE_OFFER: return deleteOffer(state, action);
        case SET_OFFERS_TRAVEL: return setOffersTravel(state, action);
        case SET_OFFERS_TRAVEL_USERS: return setOffersTravelUsers(state, action);
        case ADD_TRAVEL_USER: return addOffersTravelUser(state, action);
        case REMOVE_TRAVEL_USER: return removeOffersTravelUser(state, action);
    }
    return state;
}
