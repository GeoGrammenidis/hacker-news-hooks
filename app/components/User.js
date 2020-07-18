import React from 'react'
import queryString from 'query-string'
import { fetchUser } from '../utils/api'
import { formatDate } from '../utils/helpers'
import Posts from './Posts'
import Loading from './Loading'
import ThemeContext from '../contexts/theme'

function userReducer(state, action) {
    switch (action.type) {
        case "success":
            return {
                user: action.user,
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
            throw new Error("This type is not supported.")
    }
}

export default function User({ history, location, match }) {
    const initialState = {
        user: null,
        error: null,
        loading: true
    }
    const [state, dispatch] = React.useReducer(userReducer, initialState)
    const theme = React.useContext(ThemeContext)
    const _isMounted = React.useRef(null)
    React.useEffect(()=>{
        _isMounted.current=true;
        fetchUser(queryString.parse(location.search).id)
        .then(user => _isMounted.current&&dispatch({type:"success", user}))
        .catch(({message}) => _isMounted.current&&dispatch({type:"error", error:message}))
        return ()=>_isMounted.current=true;
    },[])
    const {user, loading, error} = state;
    return (
        <>
        {loading&&<Loading/>}
        {error&&<div>{error}</div>}
        {user&&<>
            <h1 className="header">{user.id}</h1>
            <div>
                <div className={`meta-info-${theme}`}>
                    <span>joined <b>{formatDate(user.created)}</b></span>
                    <span>has <b>{user.karma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b> karma</span>
                </div>

                <p dangerouslySetInnerHTML={{__html: user.about}} />
                <h2>Posts</h2>
            </div>
            <Posts getMap={()=>Promise.all(user.submitted)} history={history} location={location} match={match}>
            </Posts>
        </>}
    </>
    )
}