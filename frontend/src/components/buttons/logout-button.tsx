// https://github.com/auth0-developer-hub/spa_react_typescript_hello-world/blob/main/src/components/buttons/logout-button.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <Button onClick={handleLogout}>
      ログアウト
    </Button>
  );
};