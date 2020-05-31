import React, {useState} from 'react';
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SinglePetitionPage from "./pages/SinglePetitionPage";
import CreatePetitionPage from "./pages/CreatePetitionPage";
import Signin from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import {Switch, Route, Redirect} from "react-router-dom";
import {useSelector} from 'react-redux';
import ProgressComponent from "./components/ProgressComponent";

const Wrapper = () => {
  const [isLoading, setIsLoading] = useState(false);

  const userId = useSelector(state => state.auth.userId);

  const isLoadingChangeHandler = (value) => {
    setIsLoading(value);
  };

  if(isLoading) {
    return (
      <>
        <Header buttonIsVisible={false} onLoadingChange={isLoadingChangeHandler}/>
        <ProgressComponent/>
      </>
    )
  }

  return (
    <div style={{backgroundColor: 'rgb(207, 232, 252)'}}>
      <Header onLoadingChange={isLoadingChangeHandler}/>
      <Switch>
        <Route exact path="/">
          <HomePage/>
        </Route>
        <Route path="/petitions/:id/">
          <SinglePetitionPage/>
        </Route>
        <Route exact path="/petition/create">
          <CreatePetitionPage/>
        </Route>
        <Route exact path="/signin">
          {userId ? <Redirect to='/'/> : (<Signin/>)}
        </Route>
        <Route exact path="/signup">
          {userId ? <Redirect to='/'/> : (<SignUp/>)}
        </Route>
      </Switch>
    </div>
  )
};

export default Wrapper;
