import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {authReducer, petitionsReducer} from './reducers';

const rootReducer = combineReducers({
  auth: authReducer,
  petitions: petitionsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
