import React from 'react'
import Posts from './Posts'
import { fetchMap } from '../utils/api'

export default function TopComp ({ history, location, match}){
    const getMap = () => fetchMap("top")
    return (
        <Posts
            getMap={getMap}
            history={history}
            location={location}
            match={match}>
        </Posts>
    )
}