import { useAuth } from '../context/auth';

export function Admin() {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Admin</h1>
      <p>auth: {JSON.stringify(auth, null, 2)}</p>
    </div>
  );
}
