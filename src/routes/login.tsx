import { auth, storage } from '../firbase';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Grid, Link } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { IForm, Fform, JoinInput, JoinButton, LogoDiv, LogoImg } from '../components/auth-components';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';

export default function Login() {
  const navigate = useNavigate();
  const { register, formState, handleSubmit } = useForm<IForm>();

  const [logoURL, setlogoURL] = useState('');

  const user = auth.currentUser;
  if (user != null) {
    navigate('/');
  }

  const onValid = async (data: IForm) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  async function loadLogo() {
    const locationRef = await ref(storage, `logo/fulllogo.png`);
    const url = await getDownloadURL(locationRef);
    setlogoURL(url);
  }

  useEffect(() => {
    loadLogo();
  }, []);

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item md={6}>
          <LogoDiv>
            <LogoImg src={logoURL} />
          </LogoDiv>

          <Fform onSubmit={handleSubmit(onValid)}>
            <JoinInput
              {...register('email', {
                required: { value: true, message: '' },
              })}
              label="이메일"
              type="email"
              helperText={formState.errors.email ? '이메일을 입력해주세요' : ''}
              required
            />
            <JoinInput
              {...register('password', {
                required: { value: true, message: '비밀번호를 입력해주세요' },
              })}
              label="비밀번호"
              type="password"
              required
            />

            <JoinButton variant="contained" type="submit">
              로그인
            </JoinButton>
          </Fform>

          <span>아직 계정이 없으신가요? </span>
          <Link href="createaccount">회원가입</Link>
          <hr />
          <p> 테스트ID : (이메일) test@gmail.com / (비밀번호)1q2w3e4r!</p>
        </Grid>
      </Grid>
    </Container>
  );
}
