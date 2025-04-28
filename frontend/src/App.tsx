import "./App.css";
import styled from "styled-components";
import SignIn from "./pages/SignIn";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider";

function App() {
  return (
    <MainDiv>
      <UserProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          {/* <Route path="/" element={<Main />} /> */}
        </Routes>
      </UserProvider>
    </MainDiv>
  );
}

export default App;

const MainDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
