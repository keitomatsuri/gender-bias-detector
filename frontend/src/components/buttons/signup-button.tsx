// https://github.com/auth0-developer-hub/spa_react_typescript_hello-world/blob/main/src/components/buttons/signup-button.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export const SignupButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/detector",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <Button onClick={handleSignUp}>
      サインアップ
    </Button>
  );
};