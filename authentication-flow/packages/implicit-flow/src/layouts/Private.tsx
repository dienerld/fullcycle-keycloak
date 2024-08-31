import { Outlet } from 'react-router-dom';

export function PrivateLayout() {
  return (
    <>
      <p>Private</p>
      <Outlet />
    </>
  );
}
