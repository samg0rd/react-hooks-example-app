import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

// import our custom hook
import useHttp from '../hooks/http';

const Search = React.memo(props => {
  const {onLoadIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  const {isLoading, data, error, sendRequest, clear} = useHttp();

  useEffect(()=>{
    const timer = setTimeout(() => {      
      if(enteredFilter === inputRef.current.value){ // if the input hasnt change in 500 ms then send the request
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-hooks-update-8cad6.firebaseio.com/ingredients.json' + query, 'GET')   
      }            
    }, 500);

    return () => clearTimeout(timer);

  },[enteredFilter, inputRef, sendRequest])

  useEffect(()=>{
    if(!isLoading && !error && data){
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })          
      }
      onLoadIngredients(loadedIngredients);
    }
  },[data,isLoading,error,onLoadIngredients])

  return (
    <section className="search">      
      {error && <ErrorModal onClosee={clear}>{error}</ErrorModal>}
      {isLoading && <span>Loading...</span>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text" 
            value={enteredFilter} 
            onChange={e => setEnteredFilter(e.target.value)}
          />          
        </div>
      </Card>
      
    </section>
  );
});

export default Search;
