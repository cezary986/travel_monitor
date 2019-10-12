import {
  SET_USER_INIT_STATE,
  SET_USER,
  USER_SET_LOGGED_IN,
  USER_SET_AVATAR
} from './actions';
import { User } from '../../models/user';
import { Action } from 'src/app/store';
import { Profile } from 'selenium-webdriver/firefox';
import { environment } from 'src/environments/environment';

export interface IUserState {
  profile: User;
  loggedIn: boolean;
}

export const USER_INIT_STATE: IUserState = {
  profile: null,
  loggedIn: false,
};

function setUser(state: IUserState, action: Action<User>): IUserState {
  return {
    ...state,
    profile: action.payload
  };
}

function setUserAvatar(state: IUserState, action: Action<any>): IUserState {
  return {
    ...state,
    profile: {
      ...state.profile,
      avatar: {
        ...state.profile.avatar,
        image: environment.fileServerAddress + action.payload.image
      }
    }
  };
}

function setUserLoggedIn(state: IUserState, action: Action<boolean>): IUserState {
  return {
    ...state,
    loggedIn: action.payload
  };
}

export function userReducer(state: IUserState = USER_INIT_STATE, action): IUserState {
  switch (action.type) {
    case SET_USER_INIT_STATE: return state = USER_INIT_STATE;
    case SET_USER: return setUser(state, action);
    case USER_SET_LOGGED_IN: return setUserLoggedIn(state, action);
    case USER_SET_AVATAR: return setUserAvatar(state, action);
  }
  return state;
}
