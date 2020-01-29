import {useReducer, useCallback} from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
}

const httpReducer = (state, action) => {
    switch (action.type) {
      case 'SEND':
        return {        
          loading: true,
          error: null,
          extra: null,
          identifier: action.identifier
        }
      case 'RESPONSE':
        return {
          ...state,
          loading: false,
          data: action.responseData,
          extra: action.extra
        }
      case 'ERROR':  
        return {        
          loading: false,
          error: action.error
        }
      case 'CLEAR':
        return {
          ...initialState
        }
      default:
        throw new Error('should not get here!');
    }
  }

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(()=>dispatchHttp({type: 'CLEAR'}),[])

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({type: 'SEND', identifier: reqIdentifier});
        fetch(url,{
                method,
                body,
                headers: {
                    'Content-Type': 'Application/json'
                }
            }).then(res=>{
                return res.json();                                
            }).then(res=>{
                dispatchHttp({type: 'RESPONSE', responseData: res, extra: reqExtra})
            }).catch(error=>{
                dispatchHttp({type: 'ERROR', error: error.message});      
            })
    },[]);
    
    return { //what our hook returns in the end, which can be whatever, array - object or anything
      isLoading: httpState.loading,
      data: httpState.data,
      error: httpState.error,
      sendRequest,
      reqExtra: httpState.extra,
      reqIdentifier: httpState.identifier,
      clear
    };
}

export default useHttp;