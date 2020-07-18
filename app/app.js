import React from 'react';
import { Switch, BrowserRouter, Route} from 'react-router-dom';
import { ThemeProvider } from './contexts/theme'
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import useWrapper from './hooks/useWrapper';
const TopComp = React.lazy(() => import('./components/TopComp'))
const NewComp = React.lazy(() => import('./components/NewComp'))
const Post = React.lazy(() => import('./components/Post'))
const User = React.lazy(() => import('./components/User'))

export default function App() {
    const [theme, setTheme] = React.useState("light")
    const toggleTheme = () => setTheme(prevTheme=>prevTheme==="light"?"dark":"light")

    return (
    <div className={theme}>
        <div className="container">
            <BrowserRouter>
                <ThemeProvider value={theme}>
                    <Navigation toggleTheme={toggleTheme}/>
                    <React.Suspense fallback={<Loading/>}>
                        <Switch>
                            <Route path='/' exact component={TopComp} />
                            <Route path='/new' component={NewComp} />
                            <Route path='/post' component={Post} />
                            <Route path='/user' component={User} />
                            <Route component={()=><h1>404</h1>}/>
                        </Switch>
                    </React.Suspense>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    </div>
    )
}