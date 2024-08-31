import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container flex-grow">{children}</div>
      <Footer />
    </div>
  );
};