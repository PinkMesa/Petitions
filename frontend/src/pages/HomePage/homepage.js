import React, {useEffect, useState} from 'react';
import {DummyKnuPetitionService} from "../../services";
import {Container, Typography, Grid, Paper} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Petition from '../../components/petition';
import {useDispatch, useSelector} from "react-redux";
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {useHistory} from 'react-router-dom';

import './homepage.css';
import ProgressComponent from "../../components/ProgressComponent";
import {getLastExpiredPetitions, getPetitions} from "../../redux/actions/petitions";
import {CategoryTitles} from "../../dummy-data/petitions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select/Select";

const HomePage = () => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const [petitions, setPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [filterCategoryValue, setFilterCategoryValue] = useState(0);
  const [lastCategoryValue, setLastCategoryValue] = useState(0);

  const dispatch = useDispatch();

  const petitionsFromRedux = useSelector(state => state.petitions.petitions);
  const lastExpiredPetitions = useSelector(state => state.petitions.lastExpiredPetitions);
  const numPagesFromRedux = useSelector(state => state.petitions.numPages);
  const loadingFromRedux = useSelector(state => state.petitions.petitionsLoading);
  const errorFromRedux = useSelector(state => state.petitions.petitionsError);
  const statsFromRedux = useSelector(state => state.petitions.stats);

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: option => option.title,
  });

  useEffect(() => {
    dispatch(getLastExpiredPetitions());
  },[]);

  useEffect(() => {
    setPetitions(petitionsFromRedux);
    setIsLoading(loadingFromRedux);
    setIsError(errorFromRedux);
  },[petitionsFromRedux, loadingFromRedux, errorFromRedux]);

  useEffect(() => {
    fetchPetitions();
  }, [page]);

  const fetchPetitions = () => {
    dispatch(getPetitions(page, filterCategoryValue));
  };

  const categoryFilterHandler = (value) => {
    setFilterCategoryValue(value);
  };

  const setRandomFilterCategory = () => {
    let randomFilterCategoryNumber = lastCategoryValue;

    while(lastCategoryValue == randomFilterCategoryNumber) {
      randomFilterCategoryNumber = Math.floor(Math.random() * 3 + 1);
    }
    setLastCategoryValue(randomFilterCategoryNumber);
    setFilterCategoryValue(randomFilterCategoryNumber);
  };

  if (isLoading) {
    return (
      <ProgressComponent/>
    );
  }

  if (isError) {
    return (
      <Typography variant="h5">
        {`Сталася помилка при завантаженні даних з серверу. ${isError}`}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl">
      <Grid container style={{backgroundColor: '#cfe8fc'}}>
        <Grid container item lg={8} md={6} xs={12} style={{paddingTop: '2%', paddingLeft: '2%'}}>
          <Grid container item xs={12}>
            <Grid item xs={12} lg={4} style={{marginBottom: '2vh'}}>
              <Typography variant="h5" align='center' style={{
                display: 'flex',
                itemsAlign: 'center',
                justifyContent: 'center',
                fontFamily: 'Roboto-Bold',
              }}>
                Фільтрація за категорією
              </Typography>
            </Grid>
            <Grid item xs={12} lg={3} style={{marginBottom: '2vh'}}>
              <Select
                labelId="select-category-label"
                id="select-category"
                value={filterCategoryValue}
                onChange={e => categoryFilterHandler(e.target.value)}
              >
                <MenuItem value={0}>{"Всі категорії"}</MenuItem>
                <MenuItem value={1}>{CategoryTitles[0].title}</MenuItem>
                <MenuItem value={2}>{CategoryTitles[1].title}</MenuItem>
                <MenuItem value={3}>{CategoryTitles[2].title}</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} lg={2} style={{marginBottom: '2vh'}}>
              <Button
                style={{height: '100%'}}
                variant="contained"
                color="primary"
                onClick={() => {setRandomFilterCategory()}}
              >
                Випадкова
              </Button>
            </Grid>
            <Grid item xs={12} lg={3} style={{marginBottom: '2vh'}}>
              <Button
                fullWidth
                style={{height: '100%'}}
                variant="contained"
                color="primary"
                onClick={() => {fetchPetitions()}}
              >
                Відфільтрувати
              </Button>
            </Grid>
          </Grid>
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
          <Grid container item xs={12} style={{marginBottom: '2vh'}}>
            <Grid item xs={12}>
              <Button
                fullWidth
                style={{height: '100%'}}
                variant="contained"
                color="primary"
                onClick={() => {history.push('/petition/create')}}
              >
                Створити власну петицію
              </Button>
            </Grid>
          </Grid>
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
        <Grid item xs={12}>
          <Paper elevation={2} style={{backgroundColor: '#cfe8fc'}}>
            <Typography variant="body1" align='right'>
              {statsFromRedux && `Всього зібрано петицій: ${statsFromRedux.petitionsCount}, всього голосів: ${statsFromRedux.votesCount}`}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
