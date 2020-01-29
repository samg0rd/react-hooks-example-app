import React, {useReducer, useCallback, useMemo, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

// import our custom hook
import useHttp from '../hooks/http';

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'SET':      
      return action.ingredients;
    case 'ADD':
      return [...state, action.ingredient];
    case 'DELETE':
      return state.filter(ing => ing.id !== action.id);
    default:
      throw new Error('should not get here!');
  }
}

const Ingredients = () => {

  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp(); //get what we need from our useHttp custom hook

  useEffect(()=> {

    if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      // console.log('khar!');      
      dispatch({type: 'DELETE', id: reqExtra});
    }else if(!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
      console.log('data? -> ',data);      
      // console.log({id: data.name, ...reqExtra});
      dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra} })
    }
    
  },[data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredients = useCallback(filteredIngredients => {     
    dispatch({type:'SET', ingredients: filteredIngredients})
  },[]);


  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-update-8cad6.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );    
  },[sendRequest])

  const removeIngredientsHandler = useCallback(ingId => {
    sendRequest(
      `https://react-hooks-update-8cad6.firebaseio.com/ingredients/${ingId}.json`,
      'DELETE',
      null,
      ingId,
      'REMOVE_INGREDIENT'
    );
  },[sendRequest]);

  const ingredientList = useMemo(()=> {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientsHandler}/>
    )
  },[userIngredients,removeIngredientsHandler]);

  return (
    <div className="App">
      {
        error && <ErrorModal onClose={clear}>{error}</ErrorModal>
      }
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search  onLoadIngredients={filteredIngredients}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
