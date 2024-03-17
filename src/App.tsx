import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout';
import Home from './routes/home';
import Profile from './routes/profile';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/loading-scrren';
import { auth } from './firbase';
import ProtectedRoute from './components/protected-route';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/createaccount',
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
*{
  box-sizing:border-box;
  }

  body{
    margin-top: 25px;
    background-color: #B7C9F2;
    font-family:system-ui, -apple-system, BlinkMacSystemFont, 
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  async function init() {
    await auth.authStateReady();
    //wait for Firebase;
    setIsLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Wrapper>
        <GlobalStyles />
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      </Wrapper>
    </>
  );
}

export default App;
