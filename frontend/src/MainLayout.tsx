import styled from "styled-components";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Contents from "./components/Contents";

const Layout = () => {
  return (
    <>
      <SHeader>
        <Header></Header>
      </SHeader>

      <SBody>
        <SSideBar>
          <SideBar></SideBar>
        </SSideBar>

        <SContents>
          <Contents></Contents>
        </SContents>
      </SBody>
    </>
  );
};

export default Layout;

const SHeader = styled.div`
  width: 100%;
  height: 32px;
  border: 2px solid red;
`;

const SBody = styled.div`
  width: 100%;
  height: calc(100vh - 32px);
  border: 2px solid green;
  display: flex;
  flex-direction: row;
`;

const SSideBar = styled.div`
  border: 2px solid blue;
  width: 30%;
  height: 100%;
`;

const SContents = styled.div`
  border: 2px solid #ff00ff;
  width: 100%;
  height: 100%;
`;
