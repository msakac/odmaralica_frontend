import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface IDeleteModalMessageProps {
  showModal: boolean;
  id: string;
  resetState: () => void;
  doAction: () => void;
  headerMsg?: string;
  bodyMsg?: string;
}

const DeleteModalMessage = ({
  showModal,
  id,
  resetState,
  doAction,
  headerMsg = '',
  bodyMsg = '',
}: IDeleteModalMessageProps) => {
  let message;
  const header = headerMsg || `You are about to delete row ID ${id}`;
  if (bodyMsg) {
    message = bodyMsg;
  } else {
    message = (
      <>
        <div>Are you sure you want to delete this row?</div>
        <br />
        <div>This action is irreversible and may potentially affect related records.</div>
        <br />
        <div>
          <b>Once deleted, the data cannot be recovered.</b>
        </div>
      </>
    );
  }
  return (
    <Modal show={showModal} onHide={resetState} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">{message}</Modal.Body>

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
