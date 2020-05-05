import React, {useReducer, useCallback, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {TitleAndCategoryForm, DescriptionForm, Review} from "../../components/CreatePetitionForms";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formStateReducer = (state, action) => {
  console.log('action isValid ',action);
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.inputId]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.inputId]: action.isValid,
    };
    let updatedFormIsValid = true;
    console.log('UPDATED VALIDITIES ',updatedValidities);
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      console.log('updated form is valid steps ', updatedFormIsValid);
    }
    console.log('updatedForm is valid ', updatedFormIsValid);
    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }
  return state;
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    width: '60%',
    minWidth: '320px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Вибір категорії', 'Тіло петиції', 'Огляд'];

const CreatePetitionPage = () => {

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const [formState, dispatchFormState] = useReducer(formStateReducer, {
    inputValues: {
      title: '',
      category: '',
      description: '',
    },
    inputValidities: {
      title: false,
      category: false,
      description: true,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback((inputId, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        inputId: inputId,
        value: inputValue,
        isValid: inputValidity,
      });
    },
    [dispatchFormState],
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <TitleAndCategoryForm onInputChange={inputChangeHandler}
                                   categoryValue={formState.inputValues.category}
                                   titleValue={formState.inputValues.title}
                                   errorText="Будь ласка введіть заголовок петиції довжиною від 10 до 100 символів"/>;
      case 1:
        return <DescriptionForm onInputChange={inputChangeHandler}
                            descriptionValue={formState.inputValues.description}
                            errorText="Будь ласка введіть опис петиції від 50 до 500 символів" />;
      case 2:
        return <Review />;
      default:
        throw new Error('Виникла помилка');
    }
  };

  const handleNext = () => {
    //send request if
    if(activeStep === 1) {
      if(!formState.formIsValid) {
        //todo err
        console.log('smth went wrong');
      } else {

      }
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        Створення петиції
      </Typography>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment> {/*if this is last step + 1*/}
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #2001539. We have emailed your order confirmation, and will
              send you an update when your order has shipped.
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/*buttons*/}
            {getStepContent(activeStep)}
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} className={classes.button}>
                  Назад
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                disabled={activeStep === 0 ? !(formState.inputValidities.title && formState.inputValidities.category) :
                activeStep === 1 ? !formState.inputValidities.description : false}
              >
                {activeStep === steps.length - 2 ? 'Опублікувати петицію' : 'Далі'}
              </Button>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    </Paper>
  )
};

export default CreatePetitionPage;
