import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import SignUp from "./components/SignUp";
import Update from "./components/Update";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider";
import VerifyOTP from "./components/VerifyOTP";

function App() {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/main" element={<Main />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify_otp" element={<VerifyOTP />}></Route>
          <Route path="/update" element={<Update />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
