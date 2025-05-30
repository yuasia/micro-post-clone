import "./App.css";
import styled from "styled-components";
import SignIn from "./pages/SignIn";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider";
import Main from "./pages/Main";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
