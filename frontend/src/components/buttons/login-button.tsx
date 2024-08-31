// https://github.com/auth0-developer-hub/spa_react_typescript_hello-world/blob/main/src/components/buttons/login-button.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    const audience = import.meta.env.VITE_APP_AUTH0_AUDIENCE

    await loginWithRedirect({
      appState: {
        returnTo: "/detector",
        // https://dev.classmethod.jp/articles/auth0-rbac-consent-required/
        audience: audience
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  return (
    <Button onClick={handleLogin}>
      ログイン
    </Button>
  );
};