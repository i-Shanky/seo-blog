import Layout from '../components/Layout'
import SigninComponent from '../components/auth/SigninComponent'
const Login = () => {
    return (
        <Layout>
            <h2 className="text-center pt-4 pb-4">Log In</h2>
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <SigninComponent/>
                </div>
            </div>
        </Layout>
    )
}

export default Login;