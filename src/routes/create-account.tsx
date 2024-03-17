import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth, storage } from '../firbase';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Grid, Link } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { IForm, Fform, JoinInput, JoinButton, LogoImg, LogoDiv } from '../components/auth-components';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

export default function CreateAccount() {
  const navigate = useNavigate();
  const { register, formState, handleSubmit, setError } = useForm<IForm>();
  const [logoURL, setlogoURL] = useState('');

  const user = auth.currentUser;
  if (user != null) {
    navigate('/');
  }

  const onValid = async (data: IForm) => {
    try {
      const credentials = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log(credentials.user);

      await updateProfile(credentials.user, { displayName: data.name });

      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError && e.code == 'auth/email-already-in-use')
        setError('email', { message: '이미 가입된 이메일입니다.' }, { shouldFocus: true });
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
              {...register('name', {
                required: { value: true, message: ' ' },
              })}
              label="이름"
              type="text"
              variant="outlined"
              helperText={formState.errors.name ? '이름을 입력해주세요' : ''}
            />

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
              가입하기
            </JoinButton>
          </Fform>

          <Link href="/login">이미 계정이 있으신가요? 로그인하기</Link>
        </Grid>
      </Grid>
    </Container>
  );
}
