import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface IDeleteModalMessageProps {
  showModal: boolean;
  id: string;
  resetState: () => void;
  doAction: () => void;
}

const DeleteModalMessage = ({ showModal, id, resetState, doAction }: IDeleteModalMessageProps) => {
  return (
    <Modal show={showModal} onHide={resetState} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>You are about to delete row ID {id}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        Are you sure you want to delete this row?
        <br />
        <br />
        This action is irreversible and may potentially affect related records.
        <br />
        <br />
        <b>Once deleted, the data cannot be recovered.</b>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={resetState}>
          Close
        </Button>
        <Button variant="danger" onClick={doAction}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModalMessage;
