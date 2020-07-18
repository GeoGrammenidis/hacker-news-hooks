import React from 'react'
import { Link } from 'react-router-dom';
import MetaInfo from './MetaInfo'
import Loading from './Loading';
import PropTypes from 'prop-types'



export default function DataDisplay({loading, data, error, location}) {
    const generateKey = (pre) => {
        return `${ pre }_${Math.floor(Math.random() * 1000000000)}`;
    }
    return (
        <>
            {loading&&<Loading/>}
            {error&&<div className="error">{error}</div>}
            {data&&(location.pathname==="/post")?
                <>
                    {data.map(x=>
                        <div key={x.id} className="comment">
                            <MetaInfo by={x.by} time={x.time} postId={x.id}/>
                            <p dangerouslySetInnerHTML={{__html: x.text}} />
                        </div>
                    )}
                </>:
                <ul>
                    {data.map(x=>
                        x.error
                            ? <li key={generateKey("error")} className="error">{x.error}</li>
                            : <li key={x.id} className="post">
                                {x.url?
                                    <a className="link" href={x.url}>{x.title}</a>:
                                    <Link className="link" to={`/post?id=${x.id}`}>{x.title} ----- (without redirect)</Link>
                                }
                                <MetaInfo by={x.by} time={x.time} commentsNumber={x.kids?x.kids.length:0} postId={x.id}/>
                            </li>
                    )}
                </ul>
            }
        </>
    )
}

DataDisplay.propType = {
    laoding: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired
}