import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage  from "./pages/LandingPage";
import  LoginForm  from "./components/LoginRegister/main";
import AdminDashboard from "./pages/AdminDashboard";
import UserPage from "./components/UserPage/main"
import PetugasPage from "./components/Petugas/Dashboard"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/petugas" element={<PetugasPage />} />

        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
