import {useEffect} from 'react'
import Router from 'next/router'
import React from 'react'
import {isAuth} from '../../actions/auth'


const Private = ({children}) => {
    useEffect(()=> {
        if(!isAuth()) {
            Router.push(`/login`)
        }
    }, [])

    return <React.Fragment>{children}</React.Fragment>
}

export default Private;