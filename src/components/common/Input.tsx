/* eslint-disable no-unused-vars */
import React from 'react';
import { TextField } from '@mui/material';

interface IInputProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  type?: string;
}

const Input = ({ value, setValue, label, type = 'text' }: IInputProps) => {
  return (
    <TextField
      required
      label={label}
      type={type}
      className="w-100"
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Input;
