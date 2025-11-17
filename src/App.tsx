import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useAuth } from "./context/User";
import DashboardLayout from "./components/Dashboard";

const App = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <DashboardLayout /> : <Home />} />
        <Route path="/login" element={user ? <DashboardLayout /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <DashboardLayout /> : <Signup />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardLayout /> : <Login />}
        />
        <Route path="/convo/:id" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
