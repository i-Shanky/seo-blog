import React, { useState } from 'react';
import {APP_NAME} from '../config';
import Link from 'next/link'
import Router from 'next/router';
import {signout, isAuth} from '../actions/auth'
import NProgress from 'nprogress'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from 'reactstrap';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className="navbar navbar-light" style={{'backgroundColor': '#e3f2fd'}} expand="md" >
        
        <NavLink className="font-weight-bold" style={{ cursor: 'pointer'}}>
        <Link href="/">
        <img src="https://mdbootstrap.com/wp-content/uploads/2018/06/logo-mdb-jquery-small.png" alt="Title"></img>
        </Link>
        </NavLink>
        
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
          {!isAuth() && (
                <React.Fragment>
                  <NavItem>
                    <NavLink>
                      <Link href="/login">
                        <a>Login</a>
                      </Link>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>
                        <Link href="/signup">
                          <a>Sign up</a>
                        </Link>
                    </NavLink>
                  </NavItem>
               </React.Fragment>
          )}
          {isAuth() && (
              <React.Fragment>
            <NavItem>
                <Link href={isAuth().role!=1?'/user': '/admin'}>
                <NavLink style={{ cursor: 'pointer'}}>
                {`${(isAuth().name).split(' ')[0]}'s Dashboard`}
                </NavLink>
                </Link>
            </NavItem>
            <NavItem>
              <NavLink onClick={()=> signout(()=> Router.replace(`/login`))
              }>
                <Link href="/login">
                  <a>Sign out</a>
                </Link>
              </NavLink>
            </NavItem>
            </React.Fragment>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;