import React, {useState, useEffect} from 'react';
import './singlepetitionpage.css';
import {Container} from "@material-ui/core";
import {useLocation, useRouteMatch} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPetition} from '../../redux/actions/petitions';
import ProgressComponent from "../../components/ProgressComponent";
import {Grid, Typography, Paper} from '@material-ui/core';
import Chart from 'chart.js';
import ProgressSlider from "../../components/ProgressSlider";
import { makeStyles } from '@material-ui/core/styles';
import CachedIcon from '@material-ui/icons/Cached';
import AttachmentIcon from '@material-ui/icons/Attachment';
import MessageIcon from "@material-ui/icons/Message";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CreateIcon from "@material-ui/icons/Create";

const useStyles = makeStyles({
  container: {
    backgroundColor: '#c5cae9',
    paddingTop: '2vh',
  },
  gridContainer: {
  },
  petitionStatusText: {
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2vh',
    fontSize: 25,
  },
  pageTitle: {
    fontSize: 25,
  },
  votesCountText: {
    fontSize: 20,
    margin: 'auto'
  },
  text: {

  }
});

const SinglePetitionPage = props => {
  const [petition, setPetition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [votesCount, setVotesCount] = useState(0);
  const [petitionStatus, setPetitionStatus] = useState('Триває збір підписів');
  const location = useLocation();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentPetitionFromRedux = useSelector(state => state.petitions.currentPetition);
  console.log('SinglePetitionPage currentPetitionFromRedux', currentPetitionFromRedux);
  const errorFromRedux = useSelector(state => state.petitions.currentPetitionError);

  useEffect(() => {
    //check if we came from home page with state in the history.push
    let petition = location.state ? location.state.petition : null;
    if (petition) {
      setPetition(petition);
      console.log('petition from location state', petition);
      debugger;
    } else {
      const petitionId = match.params.id;
      //check if we have this petition from redux
      console.log('SinglePetitionPage currPetFromRed, petitionId', currentPetitionFromRedux, petitionId);
      if (currentPetitionFromRedux && currentPetitionFromRedux.id === petitionId) {
        setPetition(currentPetitionFromRedux);
        console.log('SinglePetitionPage petitionFromRedux');
      } else {
        console.log('SinglePetitionPage fetch petition');
        // fetch petition
        setIsLoading(true);
        dispatch(fetchPetition(petitionId)).finally(() => {
          setIsLoading(false)
        })
      }
    }
  }, [location.state, match.params, currentPetitionFromRedux]);

  useEffect(() => {
    setError(errorFromRedux);
  }, [errorFromRedux]);

  useEffect(() => {
    if(petition) {
      setVotesCount(petition.votes_count);
      setPetitionStatus(petition.answer ? 'Збір підписів завершено' : 'Триває збір підписів');
    }
  }, [petition]);

  if (errorFromRedux) {
    return (
      <div>Error</div>
    );
  }

  if (isLoading) {
    return (
      <ProgressComponent/>
    );
  }

  const data = {
    datasets: [{
      data: [votesCount, 200 - votesCount],
      backgroundColor: ['#f44336', '#3f51d5'],
      hoverBorderColor: ['#3f51d5', '#f44336']
    }],
    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'Підписи',
      'Залишилось до розгляду',
    ]
  };

  let myPieChart = new Chart('myChart', {
    type: 'pie',
    data: data,
    options: {cutoutPercentage: 50}
  });

  console.log('SinglePetitionPage petition', petition);
  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={1} className={classes.gridContainer}>
        <Grid item xs={8} style={{}} className={classes.gridSubContainer}>
          <Typography variant='subtitle1' className={classes.pageTitle}>
            Інформація про петицію
          </Typography>
          <Typography variant='subtitle1' className={classes.petitionStatusText}>
            <AttachmentIcon style={{color: '#f44336'}}/>
            &nbsp;{petition ? petition.id : null}
          </Typography>
          <Typography variant='subtitle1' className={classes.petitionStatusText}>
            <MessageIcon style={{color: '#f44336'}}/>
            &nbsp;{petition ? petition.title : null}
          </Typography>
          <Typography variant='subtitle1' style={{display: 'flex', alignItems: 'center', marginBottom: '2vh'}}>
            <CreateIcon style={{color: '#f44336'}}/>
            &nbsp;Ініціатор: {petition ? petition.creator_id : null}
          </Typography>
          <Typography variant='subtitle2' style={{display: 'flex', alignItems: 'center', marginBottom: '2vh'}}>
            <AddCircleIcon fontSize='small' style={{color: '#f44336'}}/>
            &nbsp;&nbsp;Дата оприлюднення: {petition ? petition.created_date.toLocaleDateString() : null}
          </Typography>
          <Paper elevation={3}>
            <Typography variant='body1' align='center'>
              {petition ? petition.description : null}
            </Typography>
          </Paper>
        </Grid>
        <Grid container item xs={4}>
          <Typography variant='subtitle1' align='center' className={classes.petitionStatusText}>
            <CachedIcon fontSize='large' style={{color: '#f44336'}}/>
            {petitionStatus}
          </Typography>
          <canvas id="myChart"></canvas>
          <ProgressSlider value={petition ? petition.votes_count : 0}/>
          <Typography variant='subtitle1' align='center' className={classes.votesCountText}>
            {`Зібрано ${votesCount} із 200`}
          </Typography>
        </Grid>
      </Grid>


    </Container>
  );
};

export default SinglePetitionPage;
