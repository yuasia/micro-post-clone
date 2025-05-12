import SignIn from "./pages/SignIn";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider";
import Main from "./pages/Main";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";

function App() {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/main" element={<Main />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
