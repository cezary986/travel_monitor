import { composeReducers, defaultFormReducer } from '@angular-redux/form';
import { combineReducers } from 'redux';

import { userReducer, IUserState, USER_INIT_STATE } from './common/store/user/store';
import { offersReducer, IOffersState, OFFERS_INIT_STATE } from './common/store/offers/store';
import { travelReducer, ITravelsState, TRAVEL_INIT_STATE } from './common/store/travels/store';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export interface Action<T> {
    type: string;
    payload: T;
}

export interface IAppState {
    user: IUserState;
    travels: ITravelsState;
    offers: IOffersState;
}

export const INITIAL_STATE: IAppState = {
    user: USER_INIT_STATE,
    travels: TRAVEL_INIT_STATE,
    offers: OFFERS_INIT_STATE,
};

const appReducer = composeReducers(
    defaultFormReducer(),
    combineReducers({
        user: userReducer,
        travels: travelReducer,
        offers: offersReducer,
    })
);

export const rootReducer = (state: IAppState, action): IAppState => {
    return appReducer(state, action);
};
