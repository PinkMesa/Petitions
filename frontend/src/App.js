import React, {useDispatch} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import store from './redux/store';
import Wrapper from "./Wrapper";

function App() {

  return (
    <Provider store={store}>
      <Router>
        <Wrapper/>
      </Router>
    </Provider>
  );
}

export default App;
