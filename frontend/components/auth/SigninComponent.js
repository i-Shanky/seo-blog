import Router from 'next/dist/next-server/server/router'
import React from 'react'
import router from 'next/router' 
import {useState, useEffect} from 'react'
import {signin, authenticate, isAuth} from '../../actions/auth'

const SigninComponent = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const {email, password, error, loading, message, showForm} = values

    useEffect(()=> {
        isAuth() && router.push('/');
    }, [])

    const handleSubmit = (e)=> {
        e.preventDefault();
        //console.table({name, email, password, error, loading, message, showForm});
        setValues({...values, loading: true, error: false})
        const user = {email, password}

        signin(user)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading: false})
            }
            else {
                authenticate(data, () => {
                    router.push(`/`)
                });
            }
        })
        
    }

    const handleChange = name => e => {
        setValues({...values, error: false, [name]: e.target.value})
        console.log(e.target.value)
    }

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');
    
    const signinForm = () => {
        return (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input value={email} onChange={handleChange('email')}type="email" className="form-control" placeholder="Enter email"></input>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input value={password} onChange={handleChange('password')}type="password" className="form-control" placeholder="Enter password"></input>
                    </div>

                    <div>
                         <button className="btn btn-primary btn-block">Submit</button>
                    </div>
                </form>
        )
    }
    return (
       <React.Fragment>
           {showError()}
           {showLoading()}
           {showMessage()}
           {showForm && signinForm()}
       </React.Fragment>
    )
}

export default SigninComponent;