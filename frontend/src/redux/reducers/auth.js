import {AUTHENTICATE, AUTH_ERROR, LOCAL_STORAGE_FETCH, LOCAL_STORAGE_REMOVE} from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
  username: null,
  isActive: false,
  error: null,
  isLocalStorageFetched: false,
};

export default (state = initialState, action) => {
  console.log('AUTH REDUCER ACTION',action);
  switch (action.type) {
    case AUTHENTICATE: {
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        email: action.email,
        firstName: action.firstName,
        lastName: action.lastName,
        userName: action.username,
        isActive: action.isActive,
        isLocalStorageFetched: true,
      };
    }
    case AUTH_ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }
    case LOCAL_STORAGE_FETCH: {
      return {
        ...state,
        isLocalStoreFetched: true,
      }
    }
    case LOCAL_STORAGE_REMOVE: {
      return {
        ...initialState,
        isLocalStorageFetched: true,
      }
    }
    default:
      return state;
  }
};
