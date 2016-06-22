import { CHANGE_STATE } from './actions/state.js';
import { DEBUG_MODE_ON, DEBUG_MODE_OFF } from './actions/debugMode.js';
import { FETCH_ERROR, JSON_PARSE_ERROR } from './actions/fetchHelper.js';
import { USER_GET_REQUEST, USER_GET_RESPONSE } from './actions/user.js';
import { REPO_GET_REQUEST, REPO_GET_RESPONSE } from './actions/getRepos.js';

export const debugMode = function(state=false, action) {
  switch (action.type) {
    case DEBUG_MODE_ON:
      return true;
    case DEBUG_MODE_OFF:
      return false;
    case FETCH_ERROR:
      console.log('FETCH_ERROR: ' + action.error);
      return state;
    case JSON_PARSE_ERROR:
      console.log('JSON_PARSE_ERROR: ' + action.error);
      return state;
    default:
      !state || console.log('ACTION DISPATCHED' + JSON.stringify(action));
      return state;
  }
};

export const state = function(state={}, action) {
  switch (action.type) {
    case CHANGE_STATE:
      return action.newState;
    default:
      return state;
  }
};

export const user = function (state={}, action) {
  switch (action.type) {
    case USER_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export const repos = function(state=[],action){
  switch(action.type){
    case REPO_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};


