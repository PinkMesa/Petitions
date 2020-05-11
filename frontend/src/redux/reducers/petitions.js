import {
  SET_ADDED_PETITION_ERROR,
  SET_ADDED_PETITION_LOADING,
  SET_ADDED_PETITION_URL,
  SET_CURRENT_PETITION,
  SET_CURRENT_PETITION_ERROR,
  SET_CURRENT_PETITION_LOADING, SET_LAST_EXPIRED_PETITIONS,
  SET_PETITIONS,
  SET_PETITIONS_ERROR,
  SET_PETITIONS_LOADING,
  VOTE_PETIITON, VOTE_PETITION_ERROR,
  VOTE_PETITION_LOADING
} from "../actions/petitions";

const initialState = {
  numPages: null,
  lastExpiredPetitions: null,

  petitions:null,
  petitionsError:null,
  petitionsLoading:null,

  currentPetition: null,
  currentPetitionLoading: null,
  currentPetitionError: null,

  addedPetitionUrl: null,
  addedPetitionError: null,
  addedPetitionLoading: null,

  votedPetitionId: null,
  votedPetitionMessage: null,
  votedPetitionError: null,
  votedPetitionLoading: null,
};

export default (state = initialState, action) => {
  console.log('PETITIONS REDUCER ACTION',action);
  switch (action.type) {
    case SET_PETITIONS: {
      return {
        ...state,
        petitions: action.petitions,
        numPages: action.numPages,
      }
    }
    case SET_PETITIONS_LOADING: {
      return {
        ...state,
        petitionsLoading: action.loading,
      }
    }
    case SET_PETITIONS_ERROR: {
      return {
        ...state,
        petitionsError: action.error,
      }
    }
    case SET_ADDED_PETITION_URL: {
      return {
        ...state,
        addedPetitionUrl: action.petitionUrl,
      };
    }
    case SET_ADDED_PETITION_LOADING: {
      return {
        ...state,
        addedPetitionLoading: action.loading,
      };
    }
    case SET_ADDED_PETITION_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }
    case SET_CURRENT_PETITION: {
      return {
        ...state,
        currentPetition: action.petition
      }
    }
    case SET_CURRENT_PETITION_ERROR: {
      return {
        ...state,
        currentPetitionError: action.error,
      }
    }
    case SET_CURRENT_PETITION_LOADING: {
      return {
        ...state,
        currentPetitionLoading: action.loading,
      }
    }
    case VOTE_PETIITON: {
      return {
        ...state,
        votedPetitionMessage: action.message,
        votedPetitionId: action.petitionId,
      }
    }
    case VOTE_PETITION_LOADING: {
      return {
        ...state,
        votedPetitionLoading: action.loading,
      }
    }
    case VOTE_PETITION_ERROR: {
      return {
        ...state,
        votedPetitionError: action.error,
      }
    }
    case SET_LAST_EXPIRED_PETITIONS: {
      return {
        ...state,
        lastExpiredPetitions: action.petitions,
      }
    }
    default:
      console.log('default');
      return state;
  }
};
