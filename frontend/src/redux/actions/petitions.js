import Petition from "../../models";
import {authError} from "./auth";
import User from "../../models/user";

const _basePath = 'http://127.0.0.1:8000/api/';

export const SET_LAST_EXPIRED_PETITIONS = 'SET_LAST_EXPIRED_PETITIONS';

export const SET_PETITIONS = 'SET_PETITIONS';
export const SET_PETITIONS_LOADING = 'SET_PETITIONS_LOADING';
export const SET_PETITIONS_ERROR = 'SET_PETITIONS_ERROR';

export const getLastExpiredPetitions = () => {
  return async dispatch => {
    dispatch({type: SET_PETITIONS_LOADING, loading: true});
    dispatch({type: SET_PETITIONS_ERROR, error: null});

    try {
      const response = await fetch(`${_basePath}petitions/expired/`);
      const resData = await response.json();

      const petitions = [];

      resData.petitions.forEach(petition => {
        petitions.push(new Petition(petition.id, petition.title, petition.categoryTitle, petition.text,
          petition.author, petition.voteScore, petition.createdAt, petition.answer));
      });

      dispatch({type: SET_LAST_EXPIRED_PETITIONS, petitions: petitions});
    } catch (err) {
      dispatch({type: SET_PETITIONS_ERROR, error: err});
    } finally {
      dispatch({type: SET_PETITIONS_LOADING, loading: false});
    }
  }
}

export const getPetitions = (pageNumber=1, filterCategoryValue=0, authorId=0) => {
  return async dispatch => {
    dispatch({type: SET_PETITIONS, petitions: null, numPages: 10});
    dispatch({type: SET_PETITIONS_LOADING, loading: true});
    dispatch({type: SET_PETITIONS_ERROR, error: null});

    try {
      const response = await fetch(`${_basePath}petitions/?page=${pageNumber}&category=${filterCategoryValue}&author=${authorId}`);
      const resData = await response.json();

      const petitions = [];

      const numPages = resData.numPages;

      console.log('resData', resData);
      resData.petitions.forEach(petition => {
        petitions.push(new Petition(petition.id, petition.title, petition.categoryTitle, petition.text,
          petition.author, petition.voteScore, petition.createdAt, petition.answer));
      });

      dispatch({type: SET_PETITIONS, petitions: petitions, numPages: numPages});
    } catch (err) {
      dispatch({type: SET_PETITIONS_ERROR, error: err});
    } finally {
      dispatch({type: SET_PETITIONS_LOADING, loading: false});
    }
  }
};

export const SET_ADDED_PETITION_URL = 'SET_ADDED_PETITION_URL';
export const SET_ADDED_PETITION_ERROR = 'SET_ADDED_PETITION_ERROR';
export const SET_ADDED_PETITION_LOADING = 'SET_ADDED_PETITION_LOADING';

export const SET_CURRENT_PETITION = 'SET_CURRENT_PETITION';
export const SET_CURRENT_PETITION_ERROR = 'SET_CURRENT_PETITION_ERROR';
export const SET_CURRENT_PETITION_LOADING = 'SET_CURRENT_P  ETITION_LOADING';

export const VOTE_PETITION_ERROR = 'VOTE_PETITION_ERROR';
export const VOTE_PETITION_LOADING = 'VOTE_PETITION_LOADING';
export const VOTE_PETIITON = 'VOTE_PETITION';

export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_USER_DATA_ERROR = 'SET_USER_DATA_ERROR';
export const SET_USER_DATA_LOADING = 'SET_USER_DATA_LOADING';

export const votePetition = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({type: VOTE_PETIITON, message: null, petitionId: null});
      dispatch({type: VOTE_PETITION_ERROR, error: null});
      dispatch({type: VOTE_PETITION_LOADING, loading: true});

      const token = getState().auth.token;

      const response = await fetch(`${_basePath}petitions/vote/${id}/`,
        {method: 'POST', body: JSON.stringify({'Token':token})});

      if(!response.ok) {
        const resData = await response.json();

        if(resData.message === 'ALREADY_VOTED') {
          dispatch({type: VOTE_PETIITON, message: 'Ви вже підтримували дану петицію.', petitionId: id})
        }
      } else {
        dispatch({type: VOTE_PETIITON, message: 'Вітаємо! Петиція підтримана!', petitionId: id})
      }
    } catch (err) {
      dispatch({type: VOTE_PETITION_ERROR, error: err});
    } finally {
      dispatch({type: VOTE_PETITION_LOADING, loading: false});
    }
  }
};

export const setCurrentPetitionErrror = (error) => {
  return async (dispatch) => {
    dispatch({type: SET_ADDED_PETITION_ERROR, error})
  };
};

export const fetchPetition = (id) => {
  return async (dispatch) => {
    dispatch({type: SET_CURRENT_PETITION_ERROR, error: null});
    dispatch({type: SET_CURRENT_PETITION, petition: null});
    dispatch({type: SET_CURRENT_PETITION_LOADING, loading: true});
    try {
      const response = await fetch(
        `${_basePath}petitions/petition/${id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      let resData = await response.json();
      resData = resData.petition;
      console.log('resData',resData);

      const petition = new Petition(resData.id, resData.title, resData.categoryTitle, resData.text, resData.author, resData.voteScore, resData.createdAt, resData.answer);

      dispatch({
        type: SET_CURRENT_PETITION,
        petition,
      });
    } catch (err) {
      dispatch({type: SET_CURRENT_PETITION_ERROR, error: err})
    } finally {
      dispatch({type: SET_CURRENT_PETITION_LOADING, loading: false});
    }
  };
};

export const createPetition = (title, category, description) => {
  return async (dispatch, getState) => {
    dispatch({type: SET_ADDED_PETITION_ERROR, error: null});
    dispatch({type: SET_ADDED_PETITION_URL, petitionUrl: null});
    dispatch({type: SET_ADDED_PETITION_LOADING, loading: true});

    const body = {
      'title': title,
      'category': category,
      'text': description,
    };

    try {
      const response = await fetch(`${_basePath}petitions/create/`,
          {method: 'POST', headers: {'Token': getState().auth.token}, body: JSON.stringify(body)});


      if(!response.ok) {
        const errorResData = await response.json();
        const errorMsgFromServer = errorResData.message;
        let errorMessage = 'Something went wrong!';
        if (errorMsgFromServer === 'TOKEN_DOESNT_PROVIDED') {
          errorMessage = 'Ви не авторизовані, спробуйте авторизуватися і повторити спробу';
        }
        if (errorMsgFromServer === 'INVALID_TOKEN') {
          errorMessage = 'Помилка авторизації. Спробуйте авторизуватися і повторити спробу';
        }
        throw new Error(errorMessage);
      }

      const resData = await response.json();
      console.log('resData',resData);
      const petitionUrl = resData.petitionUrl;
      console.log('petitionUrl ', petitionUrl);
      dispatch({type: SET_ADDED_PETITION_URL, petitionUrl});
    } catch(err) {
      dispatch({type: SET_ADDED_PETITION_ERROR, error: err});
    } finally {
      dispatch({type: SET_ADDED_PETITION_LOADING, loading: false});
    }

  }
};

export const getUserData = (id) => {
  console.log('GET USER DATA');
  return async (dispatch) => {
    dispatch({type: SET_USER_DATA_ERROR, error: null});
    dispatch({type: SET_USER_DATA, userData: null});
    dispatch({type: SET_USER_DATA_LOADING, loading: true});
    try {
      const response = await fetch(
        `${_basePath}petitions/user/${id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      let resData = await response.json();
      const userData = resData.user;
      console.log('userData',userData);

      const user = new User(userData.id, userData.firstName, userData.lastName, userData.username);

      dispatch({
        type: SET_USER_DATA,
        userData: user,
      });
    } catch (err) {
      dispatch({type: SET_USER_DATA_ERROR, error: err})
    } finally {
      dispatch({type: SET_USER_DATA_LOADING, loading: false});
    }
  };
};
