import React, {useReducer, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Button, CssBaseline, TextField, Checkbox, Link, Grid, Box} from '@material-ui/core';
import {FormControlLabel, Typography, Container, CircularProgress} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from '@material-ui/core/styles';
import {signUp} from '../../redux/actions/auth';
import ProgressComponent from "../../components/ProgressComponent";
import {Redirect} from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_TOUCHED = 'INPUT_TOUCHED';
const LOADING_CHANGE = 'LOADING_CHANGE';
const ERROR_CHANGE = 'ERROR_CHANGE';
const FORM_IS_VALID_CHANGE = 'FORM_IS_VALID_CHANGE';

const inputReducer = (state, action) => {
  console.log('inputReducer', action);
  switch (action.type) {
    case INPUT_CHANGE: {
      return {
        ...state,
        inputValues: {
          ...state.inputValues,
          [action.inputId]: action.value,
        },
        inputValidities: {
          ...state.inputValidities,
          [action.inputId]: action.isValid,
        },
        formIsValid: true,
      };
    }
    case INPUT_TOUCHED: {
      return {
        ...state,
        touchedValues: {
          ...state.touchedValues,
          [action.inputId]: true,
        }
      }
    }
    case LOADING_CHANGE: {
      return {
        ...state,
        isLoading: action.loading,
      }
    }
    case ERROR_CHANGE: {
      return {
        ...state,
        error: action.error,
      }
    }
    case FORM_IS_VALID_CHANGE: {
      return {
        ...state,
        formIsValid: action.isValid,
      }
    }
    default:
      return state;
  }
};

const errorTexts = {
  firstName: 'Невірний формат в полі ім\'я. Мінімальна довжена - 2 символи.',
  username: 'Невірний формат в полі нікнейм. Мінімальна довжена - 8 символів',
  lastName: 'Невірний формат в полі прізвище. Мінімальна довжина - 2 символи.',
  email: 'Невірний формат в полі email. Будь-ласка, перевірте введені дані.',
  password: 'Невірний формат в полі пароль. Мінімальна довжина 6 символів. Будь-ласка, перевірте введені дані.',
  formIsValid: 'Спочатку правильно заповніть всі поля форми.',
};

const SignUp = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const errorFromRedux = useSelector(state => state.auth.error);
  const userEmailFromRedux = useSelector(state => state.auth.email);

  useEffect(() => {
    dispatchInputState({type: ERROR_CHANGE, error: errorFromRedux});
  }, [errorFromRedux]);

  const [inputState, dispatchInputState] = useReducer(inputReducer, {
    inputValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
    inputValidities: {
      firstName: false,
      lastName: false,
      username: false,
      email: false,
      password: false,
    },
    touchedValues: {
      firstName: false,
      lastName: false,
      username: false,
      email: false,
      password: false,
    },
    isLoading: false,
    error: null,
    formIsValid: true,
  });

  const inputChangeHandler = (inputId, value) => {
    let isValid = true;

    //touched
    // if (!inputState.touchedValues[inputId]) {
    //   dispatchInputState({type: INPUT_TOUCHED, inputId})
    // }

    //input-wide error
    if (value.length < 2 || value.length > 70) {
      isValid = false;
    }

    if(inputId === 'username') {
      if(value.length < 8) {
        isValid = false;
      }
    }

    if (inputId === 'email') {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(value.toLowerCase())) {
        isValid = false;
      }
    }

    if (inputId === 'password') {
      if (value.length < 8) {
        isValid = false;
      }
    }

    dispatchInputState({type: INPUT_CHANGE, inputId, value, isValid})
  };

  const formSubmitHandler = () => {
    let localFormIsValid = inputState.formIsValid;

    for (const key in inputState.inputValidities) {
      localFormIsValid = localFormIsValid && inputState.inputValidities[key]
    }

    if (!localFormIsValid) {
      dispatchInputState({type: FORM_IS_VALID_CHANGE, isValid: false});
      return;
    } else {
      dispatchInputState({type: LOADING_CHANGE, loading: true});
      dispatch(signUp(inputState.inputValues.firstName, inputState.inputValues.lastName,
        inputState.inputValues.username, inputState.inputValues.email, inputState.inputValues.password))
        .catch(e => {
        dispatchInputState({type: ERROR_CHANGE, error: e})
      }).finally(() => dispatchInputState({type: LOADING_CHANGE, loading: false}));
    }
  };

  const onBlurHandler = (inputId) => {
    if(!inputState.touchedValues[inputId]) {
      dispatchInputState({type: INPUT_TOUCHED, inputId});
    }
  };

  if(userEmailFromRedux) {
    return <Redirect
    to={{
      pathname: "/",
        state: { email: userEmailFromRedux }
    }}
    />
  }


  if (inputState.isLoading) {
    return (
      <ProgressComponent/>
    )
  }

  console.log('state',inputState.touchedValues);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Реєстрація
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Ім'я"
                helperText={inputState.touchedValues.firstName && !inputState.inputValidities.firstName && errorTexts['firstName']}
                error={inputState.touchedValues.firstName && !inputState.inputValidities.firstName}
                onChange={(e) => inputChangeHandler('firstName', e.target.value)}
                value={inputState.inputValues.firstName}
                onBlur={() => onBlurHandler('firstName')}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Прізвище"
                name="lastName"
                autoComplete="lname"
                helperText={inputState.touchedValues.lastName && !inputState.inputValidities.lastName && errorTexts['lastName']}
                error={inputState.touchedValues.lastName && !inputState.inputValidities.lastName}
                onChange={(e) => inputChangeHandler('lastName', e.target.value)}
                value={inputState.inputValues.lastName}
                onBlur={() => onBlurHandler('lastName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="nickname"
                label="Нікнейм"
                type="nickname"
                id="nickname"
                helperText={inputState.touchedValues.username && !inputState.inputValidities.username && errorTexts['username']}
                error={inputState.touchedValues.username && !inputState.inputValidities.username}
                onChange={(e) => inputChangeHandler('username', e.target.value)}
                value={inputState.inputValues.username}
                onBlur={() => onBlurHandler('username')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email адреса"
                name="email"
                autoComplete="email"
                helperText={inputState.touchedValues.email && !inputState.inputValidities.email && errorTexts['email']}
                error={inputState.touchedValues.email && !inputState.inputValidities.email}
                onChange={(e) => inputChangeHandler('email', e.target.value)}
                value={inputState.inputValues.email}
                onBlur={() => onBlurHandler('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={inputState.touchedValues.password && !inputState.inputValidities.password && errorTexts['password']}
                error={inputState.touchedValues.password && !inputState.inputValidities.password}
                onChange={(e) => inputChangeHandler('password', e.target.value)}
                value={inputState.inputValues.password}
                onBlur={() => onBlurHandler('password')}
              />
            </Grid>
            <Grid item xs={12}>
              {inputState.error && (<Alert variant="filled" severity="error">
                {inputState.error.message}
              </Alert>)}
            </Grid>
            <Grid item xs={12}>
              {!inputState.formIsValid && (<Alert variant="filled" severity="error">
                {errorTexts['formIsValid']}
              </Alert>)}
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary"/>}
                label="Хочу отримувати всі новини та пропозиції на email!"
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={formSubmitHandler}
          >
            Реєстрація
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Вже зареєстровані? Ввійдіть
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {/*<Box mt={5}>*/}
      {/*  <Copyright/>*/}
      {/*</Box>*/}
    </Container>
  );
}

export default SignUp;
