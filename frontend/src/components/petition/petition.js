import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Typography, Grid, Paper, Hidden} from "@material-ui/core";
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MessageIcon from '@material-ui/icons/Message';
import CategoryIcon from '@material-ui/icons/Category';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CreateIcon from '@material-ui/icons/Create';
import ProgressSlider from "../ProgressSlider";
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: '#fff',
    display: 'block',
    width: '100%',
    margin: theme.spacing(1),
    padding: '1%',
    cursor: 'pointer',
  },
  boldText: {
    fontFamily: 'Roboto-Bold',
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Roboto-Regular',
    display: 'flex',
    alignItems: 'center',
  },
}));

const Petition = ({petition, isVotesCountHidden = false,}) => {
  const [elevation, setElevation] = useState(1);
  const classes = useStyles();
  const history = useHistory();

  const onMouseOver = () => {
    setElevation(22);
    console.log('window: ', window);
  };
  const onMouseOut = () => {
    setElevation(3);
  };

  const petitionClickHandler = () => {
    history.push(`/petition/${petition.id}`, {petition});
  };

  return (
    <Paper elevation={elevation} className={classes.paper}
           onMouseOver={onMouseOver}
           onMouseOut={onMouseOut}
           onClick={petitionClickHandler}>
      <Grid container spacing={0}>
        <Grid container item lg={isVotesCountHidden ? 12 : 8} xs={12}>
          <Grid item lg={6} xs={6}>
            <Typography variant="subtitle1" className={classes.text}>
              <AttachmentIcon style={{color: '#f44336'}}/>
              &nbsp;{petition.id}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={6}>
            <Typography variant="subtitle1" className={classes.text}>
              <CategoryIcon style={{color: '#f44336'}}/>
              &nbsp;{petition.category}
            </Typography>
          </Grid>
          <Grid item lg={12} xs={12}>
            <br/>
            <Typography variant="body1" className={classes.boldText}>
              <MessageIcon style={{color: '#f44336'}}/>
              &nbsp;&nbsp;{petition.title}
            </Typography>
            <br/>
          </Grid>
          <Hidden lgUp={true} xsUp={isVotesCountHidden}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" className={classes.text}>
                Зібрано голосів: {petition.votes_count}/200
              </Typography>
              <ProgressSlider value={petition.votes_count}/>
            </Grid>
          </Hidden>
          <Grid item xs={6}>
            <Typography variant="subtitle1" className={classes.text}>
              <AddCircleIcon fontSize='small' style={{color: '#f44336'}}/>
              &nbsp;&nbsp;{petition.created_date.toDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" className={classes.text}>
              <CreateIcon style={{color: '#f44336'}}/>
              &nbsp;{petition.creator_id}
            </Typography>
          </Grid>
        </Grid>
        <Hidden mdDown={true} xsUp={isVotesCountHidden}>
          <Grid container item lg={4}>
            <Grid item lg={8}>
              <Typography variant="subtitle1" className={classes.text}>
                Зібрано голосів: {petition.votes_count}/200
              </Typography>
              <ProgressSlider value={petition.votes_count}/>
            </Grid>
            <Grid item lg={4} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ArrowForwardIosOutlinedIcon fontSize='large' color='primary'/>
            </Grid>
          </Grid>
        </Hidden>
      </Grid>
    </Paper>
  )
};

export default Petition;
