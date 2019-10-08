import { composeReducers, defaultFormReducer } from '@angular-redux/form';
import { combineReducers } from 'redux';

import { userReducer, IUserState, USER_INIT_STATE } from './common/store/user/store';
import { offersReducer, IOffersState, OFFERS_INIT_STATE } from './offer/store/store';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export interface Action<T> {
    type: string;
    payload: T;
}

export interface IAppState {
    user: IUserState;
    offers: IOffersState;
}

export const INITIAL_STATE: IAppState = {
    user: USER_INIT_STATE,
    offers: OFFERS_INIT_STATE,
};

const appReducer = composeReducers(
    defaultFormReducer(),
    combineReducers({
        user: userReducer,
        offers: offersReducer
    })
);

export const rootReducer = (state: IAppState, action): IAppState => {
    return appReducer(state, action);
};
