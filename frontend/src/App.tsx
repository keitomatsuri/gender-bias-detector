import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import { AuthenticationGuard } from "@/components/authentication-guard";
import { HomePage } from "@/pages/home-page";
import { DetectorPage } from "@/pages/detector-page";
import { RealtimeDetectorPage } from "@/pages/realtime-detector-page";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/detector" element={<AuthenticationGuard component={DetectorPage} />} />
      <Route path="/realtime-detector" element={<AuthenticationGuard component={RealtimeDetectorPage} />} />
    </Routes>
  )
}

export default App
