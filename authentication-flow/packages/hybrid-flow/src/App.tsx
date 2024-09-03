import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateLayout } from './layouts/Private';
import { Callback } from './pages/Callback';
import { Logout } from './pages/Logout';
import { Login } from './pages/Login';
import { AuthProvider } from './context/auth';
import { Admin } from './pages/Admin';

export function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <h1>Hello Vite + React!</h1>,
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'logout',
      element: <Logout />,
    },
    {
      path: 'admin',
      element: <PrivateLayout />,
      children: [
        {
          path: '',
          element: <Admin />,
        },
      ],
    },
    {
      path: 'callback',
      element: <Callback />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
