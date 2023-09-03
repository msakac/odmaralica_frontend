import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { faUserCircle, faPlane, faRightFromBracket, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatar from 'assets/img/avatars/avatar.png';
import { performLogout } from 'app/store';
import routes from 'routes/routes';

type UserProfileAvatarProps = {
  name: string;
  surname: string;
  avatarSrc?: string;
};

const UserProfileAvatar = ({ name, surname, avatarSrc }: UserProfileAvatarProps) => {
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const logOut = () => {
    dispatcher(performLogout());
    navigate(routes.Home.relativePath);
  };
  return (
    <Dropdown className="user-profile-dropdown">
      <Dropdown.Toggle className="avatar-container">
        <img src={avatarSrc || avatar} alt="User Avatar" />
        <FontAwesomeIcon icon={faChevronDown} className="ms-2" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu">
        <div className="username">{`${name} ${surname}`}</div>
        <Dropdown.Item href={routes.Profile.absolutePath}>
          <FontAwesomeIcon icon={faUserCircle} className="me-2" /> My Profile
        </Dropdown.Item>
        <Dropdown.Item href="#my-trips">
          <FontAwesomeIcon icon={faPlane} className="me-2" /> My Reservations
        </Dropdown.Item>
        <Dropdown.Item onClick={logOut}>
          <FontAwesomeIcon icon={faRightFromBracket} className="me-2" /> Sign Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserProfileAvatar;
