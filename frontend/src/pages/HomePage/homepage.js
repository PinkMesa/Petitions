import React, {useEffect, useState} from 'react';
import {DummyKnuPetitionService} from "../../services";
import {Container, Typography, Grid} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Petition from '../../components/petition';

import './homepage.css';
import ProgressComponent from "../../components/ProgressComponent";

const dummyKnuPetitionService = new DummyKnuPetitionService();


const HomePage = () => {
  const [petitions, setPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dummyKnuPetitionService.getPetitions(2000).then(data => {
      setIsLoading(false);
      setPetitions(data)
    });
  }, [dummyKnuPetitionService]);

  if (isLoading) {
    return (
      <ProgressComponent/>
    );
  }

  return (
    <Container maxWidth="xl" style={{backgroundColor: '#5c6bc0'}}>
      <Grid container style={{backgroundColor: '#cfe8fc'}}>
        <Grid container item lg={8} md={6} xs={12} spacing={1} style={{paddingTop: '2%', paddingLeft: '2%'}}>
          <Grid item xs={12} style={{marginLeft: '2%'}}>
            <Typography variant="h5" style={{
              display: 'flex',
              margin: 'auto',
              itemsAlign: 'center',
              justifyContent: 'center',
              fontFamily: 'Roboto-Bold'
            }}>
              <CachedIcon fontSize='large' style={{color: '#f44336'}}/>
              &nbsp;Триває збір підписів
            </Typography>
          </Grid>
          {petitions ? petitions.map(petition => <Petition key={petition.id} petition={petition}/>) : null}
        </Grid>
        <Grid container item spacing={1} lg={4} md={6} style={{paddingTop: '2%', paddingLeft: '2%'}}>
          <Grid item xs={12} style={{marginLeft: '2%'}}>
            <Typography variant="h5" style={{
              display: 'flex',
              margin: 'auto',
              itemsAlign: 'center',
              justifyContent: 'center',
              fontFamily: 'Roboto-Bold'
            }}>
              <DoneOutlineIcon fontSize='large' style={{color: '#f44336'}}/>
              &nbsp;Підписані петиції
            </Typography>
          </Grid>
          {petitions ? petitions.map(petition => <Petition key={petition.id} petition={petition}
                                                           isVotesCountHidden={true}/>) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
