const basePath = 'http://127.0.0.1:8000/api/auth';

export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOCAL_STORAGE_FETCH = 'LOCAL_STORAGE_FETCH';
export const LOCAL_STORAGE_REMOVE = 'LOCAL_STORAGE_REMOVE';

export const authenticate = (token, userId, email, firstName, lastName, username, isActive) => {
  return {type: AUTHENTICATE, token, userId, email, firstName, lastName, username, isActive};
};

export const authError = (error) => {
  return {type: AUTH_ERROR, error: error};
};

export const getLocalstorageItem = () => {
  return async dispatch => {
    const userData = getDataFromStorage('userData');
    if (userData) {
      dispatch({type: AUTHENTICATE, userId: userData.userId, token: userData.token, email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.userName,
        isActive: userData.isActive});
    }
    dispatch({type: LOCAL_STORAGE_FETCH});
  }
};

export const removeLocalStorageItem = () => {
  return async dispatch => {
    localStorage.removeItem('userData');
    dispatch({type: LOCAL_STORAGE_REMOVE});
  }
};

export const signUp = (firstName, lastName, username, email, password) => {
  return async dispatch => {
    dispatch(authError(null));
    const response = await fetch(
      `${basePath}/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName,
          username,
          email,
          password
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log('errorResData: ', errorResData);
      const errorMsgFromServer = errorResData.message;
      let errorMessage = 'Щось пішло не так!';
      if (errorMsgFromServer === 'EMAIL_EXISTS') {
        errorMessage = `Email: "${email}" вже зареєстрований!`;
      }
      else if (errorMsgFromServer === 'USERNAME_EXISTS') {
        errorMessage = `Нікнейм: "${username}" вже зареєстрований!`;
      }
      dispatch(authError(new Error(errorMessage)));
      return;
    }

    const resData = await response.json();
    console.log('resData: ', resData);
    dispatch(authenticate(resData.token, resData.userId, resData.email, resData.first_name,
      resData.last_name, resData.username, resData.is_active));

    saveDataToStorage(resData.token, resData.userId, resData.email, resData.first_name,
      resData.last_name, resData.username, resData.is_active);
  };
};

export const signIn = (username, password, isRemember = true) => {
  console.log('signIn action, isremember',isRemember);
  return async dispatch => {
    dispatch(authError(null));
    const response = await fetch(
      `${basePath}/signin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorMsgFromServer = errorResData.message;
      let errorMessage = 'Something went wrong!';
      if (errorMsgFromServer === 'USERNAME_DOESNT_EXISTS') {
        errorMessage = 'Користувача з таким нікнеймом не існує';
      }
      if (errorMsgFromServer === 'INVALID_CREDENTIALS') {
        errorMessage = 'Не вірний нікнейм або пароль. Перевірте введені дані та спробуйте ще раз';
      }
      dispatch(authError(new Error(errorMessage)));
      return;
    }

    const resData = await response.json();
    console.log('redData: ', resData);
    dispatch(authenticate(resData.token, resData.userId, resData.email, resData.first_name,
      resData.last_name, resData.username, resData.is_active));
    if (isRemember) {
      saveDataToStorage(resData.token, resData.userId, resData.email, resData.first_name,
        resData.last_name, resData.username, resData.is_active);
    }
  };
};

const saveDataToStorage = (token, userId, email, firstName, lastName, username, isActive) => {
  localStorage.setItem(
    'userData',
    JSON.stringify({
      token,
      userId,
      email,
      firstName,
      lastName,
      username,
      isActive
    })
  );
};

const getDataFromStorage = (itemTitle) => {
  return JSON.parse(localStorage.getItem(itemTitle));
};
