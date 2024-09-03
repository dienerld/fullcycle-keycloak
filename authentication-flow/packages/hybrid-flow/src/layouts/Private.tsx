import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

export function PrivateLayout() {
  const { auth } = useAuth();
  if (!auth) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <header className="flex items-center  justify-center bg-slate-500 p-4 text-white">
        <span>Logo</span>
        <NavLink
          to="/logout"
          className="ml-auto rounded border px-2 py-1 text-sm hover:bg-slate-700"
        >
          Logout
        </NavLink>
      </header>
      <Outlet />
    </>
  );
}
