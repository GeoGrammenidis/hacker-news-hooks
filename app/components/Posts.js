import React from 'react'
import DataDisplay from './DataDisplay';
import useWrapper from '../hooks/useWrapper';

function postsReducer(state, action){
    switch (action.type) {
        case "success":
            return {
                postsMap: action.postMap,
                error: null,
                loading: false
            }
        case "error":
            return {
                ...state,
                error: action.error,
                loading: false
            }
        default:
            throw new Error(`This type of action is not supported`)
    }
}

export default function Posts({getMap, history, location, match}) {
    const initialState = {
        postsMap: [],
        error: null,
        loading: true
    }
    const [state, dispatch] = React.useReducer(postsReducer, initialState)
    const _isMounted = React.useRef(null)

    React.useEffect(() => {
        _isMounted.current = true
        getMap().then(postMap=>{
                const { error } = postMap;
                error
                    ? _isMounted.current&&dispatch({type:"error", error:`Error: ${error}`})
                    : _isMounted.current&&dispatch({type:"success", postMap})
            })
            .catch((error)=>_isMounted.current&&dispatch({type:"error", error:error.toString()}))
        return () => _isMounted.current = false
    },[])

    const {loading, data, error} = useWrapper(state.postsMap, location.pathname==="/user")
    return (
        <>
            {state.error&&<div className="error">{state.error}</div>}
            <DataDisplay 
                    data={data}
                    error={error}
                    loading={loading}
                    history={history}
                    location={location}
                    match={match}
                />
        </>
    )
}