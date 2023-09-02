import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { selectAuthentication } from 'app/store';
import UserProfileAvatar from 'components/UserProfileAvatar';
import Loader from 'components/common/Loader';
import useDebounce from 'hooks/useDebounce';
import React, { useState } from 'react';
import { Container, Form, InputGroup, Navbar } from 'react-bootstrap';

import { useSelector } from 'react-redux';

interface DashNavProps {
  // eslint-disable-next-line no-unused-vars
  setSearchTerm: (term: string) => void;
}

const DashNav = ({ setSearchTerm }: DashNavProps) => {
  const [searchTerm, setSearchTermLocal] = useState<string>('');
  useDebounce(() => setSearchTerm(searchTerm), 500, [searchTerm]);
  const { user } = useSelector(selectAuthentication);

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermLocal(e.target.value.toLowerCase());
  };

  return (
    <>
      <Loader show={false} />
      <Navbar variant="dark" expanded className="ps-0 pe-2 py-1">
        <Container fluid className="px-0">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center">
              <Form className="navbar-search">
                <Form.Group id="topbarSearch">
                  <InputGroup className="input-group-merge search-bar" onChange={onSearchInput}>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control type="text" placeholder="Search" />
                  </InputGroup>
                </Form.Group>
              </Form>
            </div>
            <UserProfileAvatar
              name={(user && user.name) || ''}
              surname={(user && user.surname) || ''}
              avatarSrc={user?.image?.image || ''}
            />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default DashNav;
