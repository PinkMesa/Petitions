import React, {useState, useReducer, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {useSelector} from "react-redux";
import ProgressComponent from "../ProgressComponent";
import {CategoryTitles} from "../../dummy-data/petitions";

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_TOUCHED = 'INPUT_TOUCHED';

const inputReducer = (state, action) => {
  console.log('inputReducer petforms actioin',action);
  switch (action.type) {
    case INPUT_CHANGE: {
      return {
        ...state,
        inputValues: {
          ...state.inputValues,
          [action.inputId]: action.value,
        },
        inputValidities: {
          ...state.inputValidities,
          [action.inputId]: action.isValid,
        },
      };
    }
    case INPUT_TOUCHED: {
      return {
        ...state,
        touchedValues: {
          ...state.touchedValues,
          [action.inputId] : action.touched,
        }
      };
    }
    default:
      return state;
  }
};

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  categorySelect: {
    margin: 'auto',
  },
  categorySelectWrapper: {
    margin: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 120,
  },
}));

const TitleAndCategoryForm = ({onInputChange, titleValue, categoryValue, errorText, ...props}) => {
  console.log('title value ' + titleValue);


  const classes = useStyles();

  const [inputState, dispatchInputState] = useReducer(inputReducer, {
    inputValues: {
      title: titleValue,
      category: categoryValue
    },
    inputValidities: {
      title: false,
      category: false,
    },
    touchedValues: {
      title: false,
      category: false,
    }
  });

  useEffect(() => {
    console.log('useeffect create petition forms inputValues.title', inputState.inputValues.title)
    if(titleValue !== inputState.inputValues.title)
      onInputChange('title', inputState.inputValues.title, inputState.inputValidities.title);
    if(categoryValue !== inputState.inputValues.category)
      onInputChange('category', inputState.inputValues.category, inputState.inputValidities.category);
  }, [inputState, onInputChange]);

  const handleChangeInput = (inputId, value) => {
    console.log('inputId: ' + inputId + ' value: ' + value);

    let isValid = true;

    if(inputId === 'title') {
        if(!inputState.touchedValues.title) {
          dispatchInputState({type: INPUT_TOUCHED, inputId, touched: true});
        }
        if(value.trim().length < 10 || value.trim().length > 100) {
          isValid = false;
        }
    }
    if(inputId === 'category') {
      if(!inputState.touchedValues.category) {
        dispatchInputState({type: INPUT_TOUCHED, inputId, touched: true});
      }
    }
    dispatchInputState({type: INPUT_CHANGE, inputId: inputId, value: value, isValid: isValid });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Введіть заголовок петиції та виберіть відповідну категорію
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            error={inputState.touchedValues.title && !inputState.inputValidities.title}
            helperText={inputState.touchedValues.title && !inputState.inputValidities.title && errorText}
            required
            label="Заголовок петиції"
            fullWidth
            autoComplete="fname"
            variant="outlined"
            value={titleValue}
            onChange={e => handleChangeInput('title', e.target.value)}
          />
        </Grid>
        <FormControl className={classes.categorySelectWrapper}>
            <InputLabel id="demo-simple-select-label">Категорія</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={categoryValue}
              onChange={e => handleChangeInput('category', e.target.value)}
            >
              <MenuItem value={1}>{CategoryTitles[0].title}</MenuItem>
              <MenuItem value={2}>{CategoryTitles[1].title}</MenuItem>
              <MenuItem value={3}>{CategoryTitles[2].title}</MenuItem>
            </Select>
        </FormControl>
      </Grid>
    </React.Fragment>
  );
};

const DescriptionForm = ({descriptionValue, errorText, onInputChange}) => {
  const [localDescriptionValue, setLocalDescriptionValue] = useState(descriptionValue);
  const [localDescriptionValidity, setLocalDescriptionValidity] = useState(false);
  const [localDescriptionTouched, setLocalDescriptionTouched] = useState(false);

  useEffect(() => {
    onInputChange('description',localDescriptionValue,localDescriptionValidity);
  },[localDescriptionValue, localDescriptionValidity]);

  const inputChangeHandler = (value) => {
    let isValid = true;

    if(!localDescriptionTouched) {
      setLocalDescriptionTouched(true);
    }

    if(value.trim().length < 40) {
      isValid = false;
    }
    if(value.length > 2000) {
      isValid = false;
      value = value.slice(0,2000);
    }

    setLocalDescriptionValue(value);
    setLocalDescriptionValidity(isValid);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Тіло петиції
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="cardName"
            label="Введіть тіло петиції з відступами"
            multiline
            fullWidth
            rowsMax={30}
            value={descriptionValue}
            onChange={(e) => inputChangeHandler(e.target.value)}
            error={localDescriptionTouched && !localDescriptionValidity}
            helperText={localDescriptionTouched && !localDescriptionValidity && errorText}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

//Review

const Review = props => {
  const classes = useStyles();

  const petitionUrl = useSelector(state => state.petitions.addedPetitionUrl);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1" gutterBottom className={classes.title}>
          {`Заголовок петиції: ${props.title}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" gutterBottom className={classes.title}>
          {`Категорія: ${props.category}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" gutterBottom className={classes.title}>
          Текст петиції:
          <pre>
          {`${props.description}`}
          </pre>
        </Typography>
      </Grid>
      </Grid>
  );
};

export {TitleAndCategoryForm, DescriptionForm, Review};
