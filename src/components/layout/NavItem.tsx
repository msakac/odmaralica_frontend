import React from 'react';
import { Link } from 'react-router-dom';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Badge, Nav, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Color } from 'react-bootstrap/esm/types';
import { useSelector } from 'react-redux';
import restrictions from 'routes/restrictions';
import { selectAuthentication } from 'app/store';

type Props = {
  title: string;
  link: string;
  target?: string;
  icon?: IconDefinition;
  image?: string;
  badgeText?: string;
  badgeBg?: string;
  badgeColor?: Color;
  pathname: string;
  restrictedTo?: string[];
};

const NavItem = ({
  title,
  pathname,
  link,
  target,
  icon,
  image,
  badgeText,
  badgeBg,
  badgeColor = 'white',
  restrictedTo = restrictions.none,
}: Props) => {
  const { user } = useSelector(selectAuthentication);
  const classNames = badgeText ? 'd-flex justify-content-between align-items-center text-white' : 'text-white';
  const navItemClassName = link === pathname ? 'nav-link my-2 py-1 active rounded' : 'nav-link my-2 py-1 rounded';

  if (user && restrictedTo.includes(user.role.role)) {
    return (
      <Nav.Item className={navItemClassName}>
        <Nav.Link as={Link} to={link} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{' '}
              </span>
            ) : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count">
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  }

  return null;
};

export default NavItem;
