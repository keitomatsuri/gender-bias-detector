// https://github.com/auth0-developer-hub/spa_react_typescript_hello-world/blob/main/src/components/page-loader.tsx
export const PageLoader: React.FC = () => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="">
      <img src={loadingImg} alt="Loading..." />
    </div>
  );
};