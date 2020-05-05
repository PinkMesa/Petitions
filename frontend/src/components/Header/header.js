import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import withWidth from '@material-ui/core/withWidth';

import './header.css';
import {getLocalstorageItem, removeLocalStorageItem} from "../../redux/actions/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Roboto-Bold',
    cursor: 'pointer',
  },
  rightAccName: {
    color: '#000'
  }
}));

const Header = ({buttonIsVisible = true, onLoadingChange, ...props}) => {
  const [emailLabel, setEmailLabel] = useState(null);

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLocalStorageFetched = useSelector(state => state.auth.isLocalStorageFetched);
  const email = useSelector(state => state.auth.email);

  useEffect(() => {
    if(!isLocalStorageFetched && !email) {
      dispatch(getLocalstorageItem());
    }
    if(email) {
      switch (props.width) {
        case 'xl':
        case 'lg': {
          setEmailLabel(email.length > 40 ? email.slice(0, 36) + '...' : email);
          break;
        }
        case 'md': {
          setEmailLabel(email.length > 23 ? email.slice(0, 20) + '...' : email);
          break;
        }
        case 'sm': {
          setEmailLabel(email.length > 14 ? email.slice(0, 12) + '...' : email);
          break;
        }
        case 'xs': {
          setEmailLabel(email.length > 9 ? email.slice(0, 5) + '...' : email);
          break;
        }
        default: {
          setEmailLabel(email);
        }
      }
    }
  },[isLocalStorageFetched, email]);

  const logInLogOutHandler = () => {
    if(email) {
      //logged in, so we need to log out
      onLoadingChange(true);
      dispatch(removeLocalStorageItem()).then(() => {}).finally(() => onLoadingChange(false));
    }
    history.push('/signin');
  };

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title} onClick={() => {history.push('/')}}>
            Петиціарна служба КНУ
          </Typography>
          {email && <Typography variant="h5" className={classes.rightAccName} onClick={() => {history.push('/')}}>
            {emailLabel}
          </Typography>}
          {buttonIsVisible && (<Button onClick={logInLogOutHandler} color="inherit">{email ? 'Вихід' : 'Вхід'}</Button>)}
        </Toolbar>
      </AppBar>
    </header>
  );

};

export default withWidth()(Header);
