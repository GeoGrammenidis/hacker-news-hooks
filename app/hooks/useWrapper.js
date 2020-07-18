import React from 'react'
import { fetchData } from '../utils/api'
import PropTypes from 'prop-types'

function wrapperReducer(state, action){
    switch (action.type) {
        case "startFetching":
            return {
                counter: 0,
                dataToFetch: action.dataMap[0],
                dataMap: action.dataMap,
                data: [],
                error: null,
                loading:true
            }
        case "end":
            return {
                ...state,
                loading: false
            }
        case "success":
            if(action.onlyStories)
                action.data = action.data.filter((x) => x.type==="story")
            action.data = action.data.filter((x) => x!=null&&!x.deleted)
            return {
                ...state,
                counter: state.counter+1,
                dataToFetch: state.counter+1 < state.dataMap.length
                    ? state.dataMap[state.counter+1]
                    : [],
                data: [...state.data, ...action.data],
                error: null,
            }
        case "error":
            return {
                ...state,
                dataToFetch: [],
                error: action.error,
            }
        default:
            throw new Error(`This type of action is not supported`)
    }
}

export default function useWrapper(dataMap=[], onlyStories=false, limit=50, incr=50 ) {
    const [frags, setFrags] = React.useState([])
    const initialState = {
        counter: 0,
        dataMap: [],
        dataToFetch: [],
        data: [],
        error: null,
        loading: false
    }
    const [state, dispatch] = React.useReducer(wrapperReducer, initialState)
    const _isMounted = React.useRef(null);

    React.useEffect(()=>{
        _isMounted.current=true;
        if(Math.ceil(dataMap.length/incr)>frags.length)
            setFrags(prevFrags=>[...prevFrags,[]])
        else if(frags.length>0){
            dataMap.forEach((x, i)=>frags[Math.floor(i/incr)].push(x))
            _isMounted.current&&dispatch({type:"startFetching", dataMap:frags})
        }
        return ()=> _isMounted.current=false
    },[frags, dataMap])

    React.useEffect(()=>{
        _isMounted.current=true;
        if(state.dataToFetch.length>0 && state.data.length<limit){
            fetchData(state.dataToFetch)
                .then(data=>{
                    const { error } = data;
                    error
                        ? _isMounted.current&&dispatch({type:"error", error:`Error: ${error}`})
                        :_isMounted.current&&dispatch({type:"success", data, onlyStories})
                })
                .catch((error)=>_isMounted.current&&dispatch({type:"error", error:error.toString()}))
        }else{
            _isMounted.current&&dispatch({type:"end"})
        }
        return ()=> _isMounted.current=false
    },[state.dataToFetch])

    return {
        loading:state.loading,
        error:state.error,
        data:state.data
    }
}

useWrapper.propType = {
    dataMap: PropTypes.array,
    limit: PropTypes.number,
    incr: PropTypes.number
}