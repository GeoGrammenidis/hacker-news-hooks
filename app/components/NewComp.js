import React from 'react'
import { fetchMap } from '../utils/api'
import Posts from './Posts'

export default function NewComp({history, location, match}) {
    const getMap = () => fetchMap("new")
    return (
        <Posts
            getMap={getMap}
            history={history}
            location={location}
            match={match}>
        </Posts>
    )
}