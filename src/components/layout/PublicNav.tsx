import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { faRightToBracket, faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import restrictions from 'routes/restrictions';
import routes from 'routes/routes';
import UserProfileAvatar from 'components/UserProfileAvatar';
// TODO Zbrejkano na mobile dok se navigiram ne skrije se
const PublicNav = () => {
  const { user } = useSelector(selectAuthentication);
  const roles = restrictions.renter;
  const location = useLocation();
  const navigate = useNavigate();
  const navigationClassName = location.pathname !== '/' ? 'navigation-wrapper-not-homepage' : '';
  const isActiveLink = (path: string) => {
    return location.pathname === `/${path}` ? 'active-link' : '';
  };

  return (
    <div className={`navigation-wrapper ${navigationClassName}`}>
      <Navbar sticky="top" expand="lg" variant="light" bg="white" className="navigation justify-content-between">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-dark">
          <FontAwesomeIcon icon={faUmbrellaBeach} className="me-2" />
          Odmaralica
        </Navbar.Brand>
        <div className="nav-links-buttons">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-center flex-grow-0 navbar-items-container" id="basic-navbar-nav">
            <Nav className="me-auto text-dark gap-1 gap-lg-4">
              <Nav.Link
                as={Link}
                to={routes.Home.relativePath}
                className={`text-center ${isActiveLink(routes.Home.relativePath)}`}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={routes.Explore.relativePath}
                className={`text-center ${isActiveLink(routes.Explore.relativePath)}`}
              >
                Explore
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={routes.Home.relativePath}
                className={`text-center ${isActiveLink(routes.Home.relativePath)}`}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={routes.Home.relativePath}
                className={`text-center ${isActiveLink(routes.Home.relativePath)}`}
              >
                Contact
              </Nav.Link>
              {user && roles.includes(user.role.role) && (
                <Nav.Link as={Link} to={routes.Dashboard.relativePath} className="text-center">
                  Dashboard
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
          <div>
            {!user ? (
              <>
                <Button
                  variant="outline-primary"
                  className="me-2 link-primary register-button d-none d-lg-inline-block"
                  onClick={() => navigate(routes.Register.relativePath)}
                >
                  Register
                </Button>
                <Button
                  variant="primary"
                  className="text-white sign-in-button"
                  onClick={() => navigate(routes.Login.absolutePath)}
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="me-2" size="lg" />
                  Sign In
                </Button>
              </>
            ) : (
              <UserProfileAvatar
                name={user.name}
                surname={user.surname}
                avatarSrc={user?.image?.image || ''}
                role={user?.role.role || ''}
              />
            )}
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default PublicNav;
