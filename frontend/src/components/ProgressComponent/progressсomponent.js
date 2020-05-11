import React from 'react';
import {CircularProgress, Container, Typography} from "@material-ui/core";

const ProgressComponent = ({text = ''}) => {
  return (
    <Container component="main" maxWidth="xs"
               style={{
                 height: '70vh',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 flexDirection: 'column'
               }}>
      <CircularProgress size={'5rem'} color='primary'/>
      <Typography variant='body1'>
        {text}
      </Typography>
    </Container>
  )
};

export default ProgressComponent;
