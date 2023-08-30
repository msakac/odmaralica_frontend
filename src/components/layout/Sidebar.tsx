import {
  faHome,
  faUser,
  faPlus,
  faList,
  faExternalLinkAlt,
  faEarthEurope,
  faClipboard,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Nav, Collapse } from 'react-bootstrap';
import routes from 'routes/routes';
import restrictions from 'routes/restrictions';
import useMediaQuery from 'hooks/useMediaQuery';
import Toggle from 'components/common/Toggle';
import CollapsibleNavItem from './CollapsibleNavItem';
import NavItem from './NavItem';

const Sidebar = () => {
  const [open, setOpen] = useState(!isMobile);
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    if (isDesktop) {
      setOpen(true);
    }
  }, [isDesktop]);

  return (
    <div className="wrapper">
      <Toggle onClick={handleToggle} />
      <Collapse in={open}>
        <Nav className="flex-column navbar w-100 text-white p-3" defaultActiveKey={routes.Dashboard.absolutePath}>
          <NavItem title="Home" link={routes.Home.absolutePath} pathname={location.pathname} icon={faExternalLinkAlt} />
          <NavItem title="Overview" link={routes.Dashboard.absolutePath} pathname={location.pathname} icon={faHome} />
          <NavItem
            title="Countries"
            link={routes.CountryCrud.absolutePath}
            pathname={location.pathname}
            icon={faEarthEurope}
          />
          <NavItem title="Log Data" link={routes.Log.absolutePath} pathname={location.pathname} icon={faClipboard} />
          <CollapsibleNavItem
            title="Users"
            eventKey="dashboard-users"
            pathname={location.pathname}
            icon={faUser}
            restrictedTo={restrictions.admin}
          >
            <NavItem
              title="Add New"
              link={routes.Home.absolutePath}
              pathname={location.pathname}
              icon={faPlus}
              restrictedTo={restrictions.admin}
            />
            <NavItem
              title="List"
              link={routes.Home.absolutePath}
              pathname={location.pathname}
              icon={faList}
              restrictedTo={restrictions.admin}
            />
          </CollapsibleNavItem>
        </Nav>
      </Collapse>
    </div>
  );
};

export default Sidebar;
