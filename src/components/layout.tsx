import { Link, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Container, Grid, Hidden } from '@mui/material';
import { auth, storage } from '../firbase';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { LogoImg } from './auth-components';
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  width: 140px;
  cursor: pointer;
  gap: 10px;
  font-size: 19px;
  &:hover {
    color: #1d9bf9;
  }
`;

const IconSet = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const VerticalLine = styled.div`
  border-left: 1px solid grey;
  height: 100%;
`;

export default function Layout() {
  const [logoURL, setlogoURL] = useState('');

  async function loadLogo() {
    const locationRef = await ref(storage, `logo/fulllogo.png`);
    const url = await getDownloadURL(locationRef);
    setlogoURL(url);
  }

  useEffect(() => {
    loadLogo();
  }, []);

  const navigate = useNavigate();

  const goHome = async () => {
    navigate('/');
  };

  const onLogOut = async () => {
    await auth.signOut();
    navigate('/login');
  };
  return (
    <Container>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item xs={0} md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Menu>
            <LogoImg src={logoURL} onClick={goHome} />
            <IconSet to="/" color="inherit">
              <MenuItem>
                <HomeIcon fontSize="large" /> <span>홈</span>
              </MenuItem>
            </IconSet>
            <IconSet to="/profile" color="inherit">
              <MenuItem>
                <AccountCircleIcon fontSize="large" /> <span>프로필</span>
              </MenuItem>
            </IconSet>

            <MenuItem onClick={onLogOut}>
              <LogoutIcon fontSize="large" />
              <span>로그아웃</span>
            </MenuItem>
          </Menu>
        </Grid>

        <Hidden xsDown>
          <Grid item md={1}>
            <VerticalLine />
          </Grid>
        </Hidden>

        <Grid item xs={12} md={5}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
}
