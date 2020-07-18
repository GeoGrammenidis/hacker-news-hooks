import React from 'react'
import queryString from 'query-string'
import { fetchItem } from '../utils/api'
import MetaInfo from './MetaInfo'
import Posts from './Posts'
import Loading from './Loading'

function postReducer(state, action) {
    switch (action.type) {
        case "success":
            return {
                post: action.post,
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
            throw new Error(`That action type isnt supported`)
    }
}

export default function Post({ history, location, match }) {
    const initialState = {
        post: null,
        error: null,
        loading: true,
    }
    const [state, dispatch] = React.useReducer(postReducer, initialState)
    const _isMounted = React.useRef(null)
    React.useEffect(()=>{
        _isMounted.current = true
        fetchItem(queryString.parse(location.search).id)
            .then(post=>{
                const { error } = post;
                error
                    ? _isMounted.current&&dispatch({type:"error", error:`Error: ${error}`})
                    : _isMounted.current&&dispatch({type:"success", post})
            })
            .catch((error)=>_isMounted.current&&dispatch({type:"error", error:error.toString()}))
        return ()=> _isMounted.current=false
    },[])
    const {loading, error, post} = state;
    return (
        <>
            {loading&&<Loading/>}
            {error&&<div className="error">{error}</div>}
            {post&&<>
                <h1 className="header">
                    <a className="link" href={post.url}>{post.title}</a>
                </h1>
                {post.text&& <div dangerouslySetInnerHTML={{__html: post.text}}></div>}
                <MetaInfo by={post.by} time={post.time} commentsNumber={post.kids?post.kids.length:0}/>
                <Posts getMap={()=>Promise.all(post.kids?post.kids:[])} history={history} location={location} match={match}>
                </Posts>
            </>}
        </>
    )
}