import Petition from "../../models";

export const SET_CURRENT_PETITION = 'SET_CURRENT_PETITION';
export const SET_CURRENT_PETITION_ERROR = 'SET_CURRENT_PETITION_ERROR';

export const setCurrentPetitionErrror = (error) => {
  return async (dispatch) => {
    dispatch({type: SET_CURRENT_PETITION_ERROR, error})
  };
};

export const fetchPetition = (id) => {
  return async (dispatch) => {
    dispatch({type: SET_CURRENT_PETITION_ERROR, error: null});
    // any async code you want!
    try {
      const response = await fetch(
        `https://knupetitions-8ddf6.firebaseio.com/petitions/${id}.json`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      console.log('resData',resData);

      const petition = new Petition(resData.id, resData.title, resData.category, resData.description, resData.creator_id, resData.votes_count, resData.created_date, resData.answer);

      dispatch({
        type: SET_CURRENT_PETITION,
        petition,
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
