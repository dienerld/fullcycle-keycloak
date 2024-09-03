import { JwtPayload } from 'jwt-decode';
import {
  exchangeCodeForTokens,
  getAuth,
  login,
  makeLoginUrl,
  makeLogoutUrl,
} from '../utils/auth';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

type AuthContextProps = {
  auth: JwtPayload | null;
  makeLoginUrl: () => string;
  login: (
    accessToken: string,
    idToken: string,
    code: string,
    state: string,
  ) => void;
  makeLogoutUrl: () => string;
};

const initContextData = {
  auth: null,
  makeLoginUrl,
  login: () => {},
  makeLogoutUrl,
};

export const AuthContext = createContext<AuthContextProps>(initContextData);
export function AuthProvider(props: PropsWithChildren) {
  const makeLogin = useCallback(
    (accessToken: string, idToken: string, code: string, state: string) => {
      const authData = login(accessToken, idToken, undefined, state);
      setData((prev) => ({
        auth: authData,
        makeLoginUrl: prev.makeLoginUrl,
        login: prev.login,
        makeLogoutUrl: prev.makeLogoutUrl,
      }));
      exchangeCodeForTokens(code).then((authData) => {
        setData((prev) => ({
          auth: authData,
          makeLoginUrl: prev.makeLoginUrl,
          login: prev.login,
          makeLogoutUrl: prev.makeLogoutUrl,
        }));
      });
      return authData;
    },
    [],
  );

  const [data, setData] = useState({
    auth: getAuth(),
    makeLoginUrl,
    login: makeLogin,
    makeLogoutUrl,
  });

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
