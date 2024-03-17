import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { FormContainer } from 'react-hook-form-mui';
import { styled as basicStyled } from 'styled-components';

export const LogoDiv = basicStyled.div`
  text-align:center;
`;

export const LogoImg = basicStyled.img`
  width: 80%;
  height: 80%;
  cursor: pointer;
`;

export const Form = styled(FormContainer)`
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

export const Fform = basicStyled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const JoinInput = styled(TextField)`
  margin: 10px;
  width: 90%;
`;

export const JoinButton = styled(Button)`
  margin: 10px;
  width: 90%;
  margin-bottom: 15px;
`;

export interface IForm {
  name: string;
  email: string;
  password: string;
  extraError?: string;
}
