import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import routes from '../routing/routes';
import { selectAuthentication } from '../../../app/store';
import UserProfileAvatar from './UserProfileAvatar/UserProfileAvatar';

const PublicNav = () => {
  const { user } = useSelector(selectAuthentication);
  return (
    <Navbar sticky="top" expand="lg" variant="light" bg="white" className="navigation justify-content-between">
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-dark">
        {/* <FontAwesomeIcon icon={faSuitcase} className="me-2" /> */}
        Odmaralica
      </Navbar.Brand>
      <div className="nav-links-buttons">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-center flex-grow-0 navbar-items-container" id="basic-navbar-nav">
          <Nav className="me-auto text-dark gap-1 gap-lg-4">
            <Nav.Link as={Link} to={routes.Home.relativePath} className="text-center">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={routes.Home.relativePath} className="text-center">
              Discover
            </Nav.Link>
            <Nav.Link as={Link} to={routes.Home.relativePath} className="text-center">
              About
            </Nav.Link>
            <Nav.Link as={Link} to={routes.Home.relativePath} className="text-center">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div>
          {!user ? (
            <>
              <Button
                href={routes.Register.relativePath}
                variant="outline-primary"
                className="me-2 link-primary register-button d-none d-lg-inline-block"
              >
                Register
              </Button>
              <Button href={routes.Login.relativePath} variant="primary" className="text-white">
                <FontAwesomeIcon icon={faRightToBracket} className="me-2" size="lg" />
                Sign In
              </Button>
            </>
          ) : (
            <UserProfileAvatar name={user.name} surname={user.surname} avatarSrc="" />
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default PublicNav;
