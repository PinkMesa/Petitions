import React, {useEffect, useState} from 'react';
import {DummyKnuPetitionService} from "../../services";
import {Container, Typography, Grid} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Petition from '../../components/petition';
import {useDispatch, useSelector} from "react-redux";
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';

import './homepage.css';
import ProgressComponent from "../../components/ProgressComponent";
import {getLastExpiredPetitions, getPetitions} from "../../redux/actions/petitions";

const dummyKnuPetitionService = new DummyKnuPetitionService();

const HomePage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const [petitions, setPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const petitionsFromRedux = useSelector(state => state.petitions.petitions);
  const lastExpiredPetitions = useSelector(state => state.petitions.lastExpiredPetitions);
  const numPagesFromRedux = useSelector(state => state.petitions.numPages);
  console.log('pet from red', petitionsFromRedux);
  const loadingFromRedux = useSelector(state => state.petitions.petitionsLoading);

  useEffect(() => {
    dispatch(getLastExpiredPetitions());
  },[]);

  useEffect(() => {
    setPetitions(petitionsFromRedux);
    setIsLoading(loadingFromRedux);
  },[petitionsFromRedux, loadingFromRedux]);

  useEffect(() => {
    dispatch(getPetitions(page));
  }, [page]);

  if (isLoading) {
    return (
      <ProgressComponent/>
    );
  }

  return (
    <Container maxWidth="xl">
      <Grid container style={{backgroundColor: '#cfe8fc'}}>
        <Grid container item lg={8} md={6} xs={12} style={{paddingTop: '2%', paddingLeft: '2%'}}>
          <Grid item xs={12} style={{}}>
            <Typography variant="h5" align='center' style={{
              display: 'flex',
              itemsAlign: 'center',
              justifyContent: 'center',
              fontFamily: 'Roboto-Bold'
            }}>
              <CachedIcon fontSize='large' style={{color: '#f44336'}}/>
              &nbsp;Триває збір підписів
            </Typography>
          </Grid>
          <Grid item container xs={12}>
            {petitions ? petitions.map(petition => <Grid key={petition.id} item container xs={12}><Petition petition={petition}/></Grid>) : null}
          </Grid>
          <Grid item xs={4}>
          </Grid>
          <Grid item xs={8} style={{marginBottom: '2vh'}}>
            <Pagination
              page={page}
              count={numPagesFromRedux}
              size='large'
              color='primary'
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                  {...item}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container item lg={4} md={6} xs={12} style={{paddingTop: '2%', paddingLeft: '2%'}} alignContent='flex-start' justify='flex-start' alignItems='flex-start'>
          <Grid item xs={12} style={{}}>
            <Typography variant="h5" align='center' style={{
              fontFamily: 'Roboto-Bold',
              display: 'flex',
              itemsAlign: 'center',
              justifyContent: 'center',
            }}>
              <DoneOutlineIcon fontSize='large' style={{color: '#f44336'}}/>
              &nbsp;Останні підписані петиції
            </Typography>
          </Grid>
          <Grid item container xs={12} alignItems='flex-start' style={{}}>
            {lastExpiredPetitions ? lastExpiredPetitions.slice(0,5).map(petition => <Grid key={petition.id} container item xs={12}><Petition petition={petition}
                                                                                           isVotesCountHidden={true}/></Grid>) : null}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
