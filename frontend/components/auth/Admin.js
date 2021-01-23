import {useEffect} from 'react'
import Router from 'next/router'
import React from 'react'
import {isAuth} from '../../actions/auth'


const Admin = ({children}) => {
    useEffect(()=> {
        if(!isAuth()) {
            Router.push(`/login`)
        }
        if(isAuth().role!==1) {
            Router.replace(`/`)
        }
    }, [])

    return <React.Fragment>{children}</React.Fragment>
}

export default Admin;