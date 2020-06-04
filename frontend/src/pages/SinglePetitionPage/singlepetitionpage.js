import React, {useState, useEffect} from 'react';
import './singlepetitionpage.css';
import {Container} from "@material-ui/core";
import {useLocation, useRouteMatch} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPetition, votePetition} from '../../redux/actions/petitions';
import ProgressComponent from "../../components/ProgressComponent";
import {Grid, Typography, Paper, Button} from '@material-ui/core';
import Chart from 'chart.js';
import ProgressSlider from "../../components/ProgressSlider";
import { makeStyles } from '@material-ui/core/styles';
import CachedIcon from '@material-ui/icons/Cached';
import AttachmentIcon from '@material-ui/icons/Attachment';
import MessageIcon from "@material-ui/icons/Message";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CreateIcon from "@material-ui/icons/Create";
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    backgroundColor: 'rgb(207, 232, 252)',
    paddingTop: '2vh',
    fontFamily: 'Roboto',
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
  const history = useHistory();
  const [petition, setPetition] = useState(null);
  const isLoadingFromRedux = useSelector(state => state.petitions.currentPetitionLoading);
  const errorFromRedux = useSelector(state => state.petitions.currentPetitionError);
  const votedPetitionLoading = useSelector(state => state.petitions.votedPetitionLoading);
  const votedPetitionMessage = useSelector(state => state.petitions.votedPetitionMessage);
  const votedPetitionId = useSelector(state => state.petitions.votedPetitionId);
  const tokenFromRedux = useSelector(state => state.auth.token);
  const [votesCount, setVotesCount] = useState(0);
  const [petitionStatus, setPetitionStatus] = useState('Триває збір підписів');
  const location = useLocation();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentPetitionFromRedux = useSelector(state => state.petitions.currentPetition);

  useEffect(() => {
    dispatch(fetchPetition(match.params.id));
  },[votedPetitionMessage]);

  useEffect(() => {
    const petitionId = match.params.id;
    if (currentPetitionFromRedux && currentPetitionFromRedux.id === petitionId) {
      setPetition(currentPetitionFromRedux);
    } else {
      dispatch(fetchPetition(petitionId));
    }

  }, []);

  useEffect(() => {
    if(petition) {
      setVotesCount(petition.votes_count);
      setPetitionStatus(petition.answer ? 'Збір підписів завершено' : 'Триває збір підписів');
    }
  }, [petition]);

  useEffect(() => {
    if(petition) {
      setVotesCount(petition.votes_count);
      setPetitionStatus(petition.answer ? 'Збір підписів завершено' : 'Триває збір підписів');
    }
  }, [petition]);

  useEffect(() => {
    setPetition(currentPetitionFromRedux);
  },[currentPetitionFromRedux]);

  if (errorFromRedux) {
    return (
      <div>Error</div>
    );
  }

  if (isLoadingFromRedux) {
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

  const votePetitionHandler = () => {
    if(!tokenFromRedux) history.push('/signin');
    else dispatch(votePetition(petition.id));
  };

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={1} className={classes.gridContainer}>
        <Grid item md={8} xs={12} className={classes.gridSubContainer}>
          <Grid item xs={12} className={classes.gridSubContainer}>
            <Typography variant='subtitle1' className={classes.pageTitle} align='center'>
              Інформація про петицію
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridSubContainer}>
            <Typography variant='subtitle1' className={classes.petitionStatusText}>
              <AttachmentIcon style={{color: '#f44336'}}/>
              &nbsp;{petition ? petition.id : null}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridSubContainer}>
            <Typography variant='subtitle1' className={classes.petitionStatusText}>
              <MessageIcon style={{color: '#f44336'}}/>
              &nbsp;{petition ? petition.title : null}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridSubContainer} style={{cursor: 'pointer'}}
                onClick={() => {history.push(`/user/${petition.creator.id}`)}}>
          <Typography variant='subtitle1' style={{display: 'flex', alignItems: 'center', marginBottom: '2vh',
            textDecoration: 'underline'}}>
              <CreateIcon style={{color: '#f44336'}}/>
              &nbsp;Ініціатор: {petition ? petition.creator.firstName+" "+petition.creator.lastName : null}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridSubContainer}>
          <Typography variant='subtitle2' style={{display: 'flex', alignItems: 'center', marginBottom: '2vh'}}>
              <AddCircleIcon fontSize='small' style={{color: '#f44336'}}/>
              &nbsp;&nbsp;Дата оприлюднення: {petition ? petition.created_date.toLocaleDateString() : null}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridSubContainer}>
            <Typography variant='h6' align='left'>
            {`Текст петиції: `}
            </Typography>
            <br/>
            <Paper elevation={3} style={{padding: '1%',backgroundColor: 'rgb(207, 232, 252)'}}>
              <Typography variant='body1' align='left'>
                {petition ? petition.description.split('\n').map((i,key) =>
                  (<p key={key}><pre style={{fontFamily: 'Roboto-Regular'}}>{i}</pre></p>)) : null}
              </Typography>
            </Paper>
          </Grid>
          {petition && petition.answer && (
            <Grid item xs={12} className={classes.gridSubContainer}>
              <Typography variant='h6' align='left'>
                {`Відповідь на петицію: `}
              </Typography>
              <Paper elevation={3} style={{padding: '1%',backgroundColor: 'rgb(207, 232, 252)'}}>
                <Typography variant='body1' align='left' className={classes.votesCountText}>
                  {petition.answer.split('\n').map((i,key) =>
                    (<p key={key}><pre style={{fontFamily: 'Roboto-Regular'}}>{i}</pre></p>))}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
        <Grid container item md={4} xs={12}>
          <Grid item xs={12}>
            <Typography variant='subtitle1' align='center' className={classes.petitionStatusText}>
              <CachedIcon fontSize='large' style={{color: '#f44336'}}/>
              {petitionStatus}
            </Typography>
            {petition && (<canvas id="myChart"></canvas>)}
            <ProgressSlider value={petition ? petition.votes_count : 0}/>
            <Typography variant='subtitle1' align='center' className={classes.votesCountText}>
              {`Зібрано ${votesCount} із 200`}
            </Typography>
          </Grid>
          {petition && !petition.answer && (
            <Grid item xs={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Button variant="contained" color="secondary" size="large" onClick={votePetitionHandler}
                      disabled={votedPetitionLoading}>
                Підтримати петицію
              </Button>
            </Grid>)
          }
            {petition && votedPetitionMessage && votedPetitionId == petition.id && (
              <Grid item xs={12}>
                <Typography variant='body1' align='center'>
                  {votedPetitionMessage}
                </Typography>
              </Grid>
            )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SinglePetitionPage;
