import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import UsersPage from '../components/Users/UsersPage';
import SingleUserPage from '../components/Users/SingleUserPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/:userId",
        element: <SingleUserPage />,
      },
    ],
  },
]);