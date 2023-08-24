/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import avatar from '../../../../assets/img/avatars/avatar.png';
import { performLogout } from '../../../../app/store';

type UserProfileAvatarProps = {
  name: string;
  surname: string;
  avatarSrc?: string;
};

const UserProfileAvatar = ({ name, surname, avatarSrc }: UserProfileAvatarProps) => {
  const dispatcher = useDispatch();
  const logOut = () => {
    dispatcher(performLogout());
  };
  return (
    <Dropdown className="user-profile-dropdown">
      <Dropdown.Toggle className="avatar-container">
        <img src={avatarSrc || avatar} alt="User Avatar" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu">
        <div className="username">{`${name} ${surname}`}</div>
        <Dropdown.Item href="#manage-account">Manage Account</Dropdown.Item>
        <Dropdown.Item href="#my-trips">My Trips</Dropdown.Item>
        <Dropdown.Item onClick={logOut}>Sign Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserProfileAvatar;
