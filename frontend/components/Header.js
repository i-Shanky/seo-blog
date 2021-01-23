import React, { useState } from 'react';
import {APP_NAME} from '../config';
import Link from 'next/link'
import Router from 'next/router';
import {signout, isAuth} from '../actions/auth'
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


const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className="navbar navbar-light" style={{'backgroundColor': '#e3f2fd'}} expand="md" >
        <Link href="/">
        <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
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
              <NavbarText>Hello {(isAuth().name).split(' ')[0]}!</NavbarText>
              <NavItem>
              <NavLink onClick={()=> signout(()=> Router.replace(`/login`))
              }>
                <Link href="/login">
                  <a>Sign out</a>
                </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={()=>(isAuth().role!=1)?Router.replace(`/user`):Router.replace(`/admin`)
              }>
                <Link href="/user">
                  <a>Dashboard</a>
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