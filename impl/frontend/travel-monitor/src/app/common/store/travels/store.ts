import {
    SET_TRAVELS_INIT_STATE,
    SET_TRAVELS,
    REMOVE_TRAVEL,
    ADD_TRAVEL,
    UPDATE_TRAVEL
} from './actions';

import { Action } from 'src/app/store';
import { Travel } from '../../models/travel';

export interface ITravelsState {
    travels: Travel[];
}

export const TRAVEL_INIT_STATE: ITravelsState = {
    travels: null
};

function setTravels(state: ITravelsState, action: Action<Travel[]>): ITravelsState {
    return {
        ...state,
        travels: action.payload
    };
}

function addTravel(state: ITravelsState, action: Action<Travel>): ITravelsState {
    const newTravels = [...state.travels];
    newTravels.push(action.payload);
    return {
        ...state,
        travels: newTravels
    };
}

function removeTravel(state: ITravelsState, action: Action<Travel>): ITravelsState {
    const index = state.travels.findIndex((el) => {
        return el.id === action.payload.id;
    });
 
    if (index !== undefined && index >= 0) {
        let newTravels = [...state.travels];
        newTravels = newTravels.splice(index , 1);
        return {
            ...state,
            travels: newTravels
        };
    } else {
        return state;
    }
}

function updateTravel(state: ITravelsState, action: Action<Travel>): ITravelsState {
    const index = state.travels.findIndex((el) => {
        return el.id === action.payload.id;
    });
    if (index !== undefined && index > 0) {
        const newTravels = [...state.travels];
        newTravels[index] = action.payload;
        return {
            ...state,
            travels: newTravels
        };
    } else {
        return state;
    }
}

export function travelReducer(state: ITravelsState = TRAVEL_INIT_STATE, action): ITravelsState {
    switch (action.type) {
        case SET_TRAVELS_INIT_STATE: return state = TRAVEL_INIT_STATE;
        case SET_TRAVELS: return setTravels(state, action);
        case ADD_TRAVEL: return addTravel(state, action);
        case REMOVE_TRAVEL: return removeTravel(state, action);
        case UPDATE_TRAVEL: return updateTravel(state, action);
    }
    return state;
}
