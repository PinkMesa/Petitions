import React, {useEffect, useState} from 'react';
import {Link, useParams, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getLastExpiredPetitions, getPetitions, getUserData} from "../../redux/actions/petitions";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import {Container, Grid, Typography} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import CachedIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Petition from "../../components/petition";
import ProgressComponent from "../../components/ProgressComponent";

const SingleUserPetitionsPage = () => {
  const numPagesFromRedux = useSelector(state => state.petitions.numPages);
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const [petitions, setPetitions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const userDataFromRedux = useSelector(state => state.petitions.userData);
  const userDataLoadingFromRedux = useSelector(state => state.petitions.userDataLoading);
  const userDataErrorFromRedux = useSelector(state => state.petitions.userDataError);
  const petitionsFromRedux = useSelector(state => state.petitions.petitions);
  const loadingFromRedux = useSelector(state => state.petitions.petitionsLoading);
  const errorFromRedux = useSelector(state => state.petitions.petitionsError);
  const lastExpiredPetitions = useSelector(state => state.petitions.lastExpiredPetitions);
  //тут надо сразу вызвать получение данных, чтобы пошла загрузка, т.к. юзаем те же данные
  //что и в хомпейдже

  const { id } = useParams();

  useEffect(() => {
    dispatch(getLastExpiredPetitions());
    if(id) dispatch(getUserData(id));
    fetchPetitions();
  },[id]);

  useEffect(() => {
    console.log('SINGLE USER PET USER DATA', userDataFromRedux);
    setPetitions(petitionsFromRedux);
    setUserData(userDataFromRedux);

    if(loadingFromRedux || userDataLoadingFromRedux)
      setIsLoading(true);
    else setIsLoading(false);
    if(errorFromRedux || userDataErrorFromRedux)
      setIsError(true);
    else setIsError(false);
  },[petitionsFromRedux, loadingFromRedux, errorFromRedux,
    userDataFromRedux, userDataErrorFromRedux, userDataLoadingFromRedux]);

  useEffect(() => {
    fetchPetitions();
  }, [page, id]);

  const fetchPetitions = () => {
    console.log('fetching petitions with author id ',id);
    dispatch(getPetitions(page, 0, id));
  };

  if (isLoading) {
    return (
      <ProgressComponent/>
    );
  };

  if (isError) {
    return (
      <Typography variant="h5">
        {`Сталася помилка при завантаженні даних з серверу. ${isError}`}
      </Typography>
    );
  };

  return (
    <Container maxWidth="xl">
      <Grid container style={{backgroundColor: '#cfe8fc'}}>
        <Grid container item lg={8} md={6} xs={12} style={{paddingTop: '2%', paddingLeft: '2%'}}>
          <Grid item xs={12}>
            <Typography variant="h6" align='center' style={{
              display: 'flex',
              itemsAlign: 'center',
              justifyContent: 'flex-start',
              fontFamily: 'Roboto-Bold'
            }}>
              <CachedIcon fontSize='large' style={{color: '#f44336'}}/>
              &nbsp;{userData && `Користувач: ${userData.firstName} ${userData.lastName}`}
            </Typography>
            <Typography variant="h6" align='center' style={{
              display: 'flex',
              itemsAlign: 'center',
              justifyContent: 'flex-start',
              fontFamily: 'Roboto-Bold'
            }}>
              <CachedIcon fontSize='large' style={{color: '#f44336'}}/>
              &nbsp;{userData && `Нікнейм: ${userData.firstName} ${userData.lastName}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" align='center' style={{
              display: 'flex',
              itemsAlign: 'center',
              justifyContent: 'flex-start',
              fontFamily: 'Roboto-Bold'
            }}>
              <CachedIcon fontSize='large' style={{color: '#f44336'}}/>
              &nbsp;Всі петиції користувача:
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
                  to={`${item.page === 1 ? `/user/${id}` : `/user/${id}?page=${item.page}`}`}
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
  )
};

export default SingleUserPetitionsPage;
