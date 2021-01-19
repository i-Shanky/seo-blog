import React, { useState } from 'react';
import {APP_NAME} from '../config';
import Link from 'next/link'

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
          <NavItem>
              <NavLink>
                <Link href="/signin">
                  <a>Signin</a>
                </Link>
              </NavLink>
            </NavItem>
          <NavItem>
              <NavLink>
                <Link href="/signup">
                  <a>Signup</a>
                </Link>
              </NavLink>
            </NavItem>
          </Nav>
          <NavbarText>Simple Text</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;