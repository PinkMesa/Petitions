import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import ProgressComponent from "../../components/ProgressComponent";
import {useDispatch, useSelector} from "react-redux";
import {signIn} from "../../redux/actions/auth";

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
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(true);

  const errorFromRedux = useSelector(state => state.auth.error);

  useEffect(() => {
    setError(errorFromRedux);
  }, [errorFromRedux]);

  if (isLoading) {
    return (
      <ProgressComponent/>
    )
  }

  const changeUsernameHandler = (value) => {
    setUsername(value);
  };

  const changePasswordHandler = (value) => {
    setPassword(value);
  };

  const changeIsRemember = (value) => {
    setIsRemember(value);
  };

  const submitFormHandler = () => {
    setError(null);
    if (username.length === 0 || password.length === 0) {
      setError(new Error('Спочатку заповніть всі поля форми'));
      return;
    }
    setIsLoading(true);
    dispatch(signIn(username, password, isRemember)).finally(() => setIsLoading(false));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Вхід
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Нікнейм"
            name="username"
            value={username}
            onChange={e => changeUsernameHandler(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            value={password}
            onChange={e => changePasswordHandler(e.target.value)}
            autoComplete="current-password"
          />
          {error && (<Alert variant="filled" severity="error">
            {error.message}
          </Alert>)}
          <FormControlLabel
            control={<Checkbox checked={!isRemember} onChange={e => changeIsRemember(!e.target.checked)}
                               value="remember" color="primary"/>}
            label="Чужий комп'ютер"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={submitFormHandler}
          >
            Ввійти
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Забули пароль?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Реєстрація акаунту"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );
};

export default Signin;
