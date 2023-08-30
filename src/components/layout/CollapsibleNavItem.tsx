import React from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import restrictions from 'routes/restrictions';
import { selectAuthentication } from 'app/store';

type Props = {
  eventKey: string;
  title: string;
  icon: IconDefinition;
  children: React.ReactNode | null;
  pathname: string;
  restrictedTo?: string[];
};

const CollapsibleNavItem = ({
  eventKey,
  title,
  icon,
  pathname,
  children = null,
  restrictedTo = restrictions.none,
}: Props) => {
  const { user } = useSelector(selectAuthentication);
  const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : '';
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  if (user && restrictedTo.includes(user.role.role)) {
    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey} className="w-100 nav-dropdown">
        <Accordion.Item eventKey={eventKey} className="accordion-item-custom">
          <Accordion.Button
            as={Nav.Link}
            className="bg-dark"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <span>
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{' '}
              </span>
              <span className="sidebar-text">{title}</span>
              <span className="dropdown-icon">
                <FontAwesomeIcon icon={faChevronDown} className={`${isOpen && 'svg-open'}`} />{' '}
              </span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="bg-dark">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

  return null;
};

export default CollapsibleNavItem;
