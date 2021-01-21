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
                <NavItem>
                <NavLink>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                </NavLink>
              </NavItem>
          )}
          {!isAuth() && (
            <NavItem>
                <NavLink>
                  <Link href="/signup">
                    <a>Sign up</a>
                  </Link>
                </NavLink>
              </NavItem>
          )}
            {isAuth() && (
              <NavItem>
              <NavLink onClick={()=> signout(()=> Router.replace(`/login`))
              }>
                <Link href="/login">
                  <a>Sign out</a>
                </Link>
              </NavLink>
            </NavItem>
            )}
          </Nav>
          <NavbarText>Hello Null</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;