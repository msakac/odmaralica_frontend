import {
  faHome,
  faExternalLinkAlt,
  faEarthEurope,
  faClipboard,
  faUsers,
  faLandmark,
  faCity,
  faLocationDot,
  faHotel,
  faHouseChimneyUser,
  faCirclePlus,
  faHouseLock,
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
          <CollapsibleNavItem
            title="Residences"
            pathname={location.pathname}
            eventKey="dashboard-residence"
            icon={faHotel}
            restrictedTo={restrictions.renter}
          >
            <NavItem
              title="Residences"
              link={routes.AdminResidences.absolutePath}
              pathname={location.pathname}
              icon={faHouseLock}
              restrictedTo={restrictions.moderator}
            />
            <NavItem
              title="My Residences"
              link={routes.RenterResidences.absolutePath}
              pathname={location.pathname}
              icon={faHouseChimneyUser}
            />
            <NavItem
              title="New Residence"
              link={routes.CreateResidence.absolutePath}
              pathname={location.pathname}
              icon={faCirclePlus}
            />
          </CollapsibleNavItem>

          <NavItem
            title="Log History"
            link={routes.Logs.absolutePath}
            pathname={location.pathname}
            icon={faClipboard}
            restrictedTo={restrictions.admin}
          />
          <NavItem
            title="Users"
            link={routes.Users.absolutePath}
            pathname={location.pathname}
            icon={faUsers}
            restrictedTo={restrictions.admin}
          />

          <CollapsibleNavItem
            title="Location"
            pathname={location.pathname}
            eventKey="dashboard-location"
            icon={faLocationDot}
            restrictedTo={restrictions.admin}
          >
            <NavItem
              title="Countries"
              link={routes.CountryCrud.absolutePath}
              pathname={location.pathname}
              icon={faEarthEurope}
            />
            <NavItem title="Regions" link={routes.Regions.absolutePath} pathname={location.pathname} icon={faLandmark} />
            <NavItem title="Cities" link={routes.Cities.absolutePath} pathname={location.pathname} icon={faCity} />
          </CollapsibleNavItem>
        </Nav>
      </Collapse>
    </div>
  );
};

export default Sidebar;
