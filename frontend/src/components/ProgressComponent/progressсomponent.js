import React from 'react';
import {CircularProgress, Container} from "@material-ui/core";

const ProgressComponent = () => {
  return (
    <Container component="main" maxWidth="xs"
               style={{height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <CircularProgress size={'5rem'} color='primary'/>
    </Container>
  )
};

export default ProgressComponent;
