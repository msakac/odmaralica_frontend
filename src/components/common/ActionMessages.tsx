/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import Animate from 'components/common/Animate';
import React, { useEffect, useState, useImperativeHandle, forwardRef, Ref } from 'react';
import { Alert, Col } from 'react-bootstrap';

export enum Action {
  Create = 'create',
  Update = 'update',
  None = 'none',
}

export enum MessageType {
  Ok = 'ok',
  Error = 'error',
}

export interface IMessage {
  message: string;
  timeRemaining: number;
  type: MessageType;
}

export interface ActionMessagesRef {
  createMessage: (message: string, type: MessageType) => void;
}

const ActionMessages = forwardRef((props, ref: Ref<ActionMessagesRef>) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useImperativeHandle(ref, () => ({
    createMessage(message: string, type: MessageType) {
      const messageObj = { message, timeRemaining: 7, type };
      setMessages([messageObj, ...messages]);
    },
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev
          .filter((i) => i.timeRemaining > 0)
          .map((item) => {
            return {
              ...item,
              timeRemaining: item.timeRemaining - 1,
            };
          })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Col xs={12} lg={4}>
      {messages.map((message: IMessage, index: number) => (
        <div className="pb-1">
          <Animate key={index}>
            <Alert variant={message.type === MessageType.Ok ? 'success' : 'danger'} className="w-fit m-0">
              {message.message}
            </Alert>
          </Animate>
        </div>
      ))}
    </Col>
  );
});

export default ActionMessages;
