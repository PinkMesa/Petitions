import {SET_CURRENT_PETITION} from "../actions/petitions";

const initialState = {
  currentPetition: null,
  currentPetitionError: null,
};

export default (state = initialState, action) => {
  console.log('PETITIONS REDUCER ACTION',action);
  switch (action.type) {
    case SET_CURRENT_PETITION: {
      return {
        ...state,
        currentPetition: action.petition,
      };
    }
    default:
      return state;
  }
};
