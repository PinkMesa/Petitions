import React, {useReducer, useCallback, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {TitleAndCategoryForm, DescriptionForm, Review} from "../../components/CreatePetitionForms";
import {useDispatch, useSelector} from "react-redux";
import {createPetition} from "../../redux/actions/petitions";
import ProgressComponent from "../../components/ProgressComponent";
import {CategoryTitles} from "../../dummy-data/petitions";
import {useHistory} from 'react-router-dom';

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

const steps = ['Вибір категорії', 'Тіло петиції', 'Перевірка даних'];

const CreatePetitionPage = () => {
  console.log('CREATE PETITION PAGE');
  const history = useHistory();
  const isLoading = useSelector(state => state.petitions.addedPetitionLoading);
  const petitionUrl = useSelector(state => state.petitions.addedPetitionUrl);
  const dispatch = useDispatch();

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
        return <Review title={formState.inputValues.title} category={CategoryTitles[formState.inputValues.category]}
                       description={formState.inputValues.description}/>;
      default:
        throw new Error('Виникла помилка');
    }
  };

  const handleNext = () => {
    //send request if
    if(activeStep === 2) {
      if(!formState.formIsValid) {
        //todo err
        console.log('smth went wrong');
      } else {
        dispatch(createPetition(formState.inputValues.title,
          formState.inputValues.category, formState.inputValues.description));
      }
    }
    if(activeStep === steps.length) {
      history.push(`/petitions/${petitionUrl}`);
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
        {activeStep === steps.length ? isLoading ? (<ProgressComponent text='Створюємо петицію, зачекайте.'/>) : (
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              Дякуємо за опублікування петиції.
            </Typography>
            <Typography variant="subtitle1">
              {`Посилання на петицію: ${petitionUrl}`}
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/*buttons*/}
            {getStepContent(activeStep)}
            <div className={classes.buttons}>
              {activeStep != 0 && activeStep != steps.length && (
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
                {activeStep === steps.length - 1 ? 'Опублікувати петицію' : activeStep === steps.length ?
                  'На сторінку петиції' : 'Далі'}
              </Button>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    </Paper>
  )
};

export default CreatePetitionPage;
