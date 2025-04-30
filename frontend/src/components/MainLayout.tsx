import styled from "styled-components";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Contents from "../components/Contents";

const MainLayout = () => {
  return (
    <>
      <SHeader>
        <Header />
      </SHeader>

      <SBody>
        <SSideBar>
          <SideBar />
        </SSideBar>

        <SContents>
          <Contents />
        </SContents>
      </SBody>
    </>
  );
};

export default MainLayout;

const SHeader = styled.div`
  width: 100%;
  height: 70px;
  box-shadow: 0px 4px 4px #aaaaaa;
`;

const SBody = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  display: flex;
`;

const SSideBar = styled.div`
  border-right: 1px solid #aaaaaa;
  width: 50%;
  height: 100%;
`;

const SContents = styled.div`
  width: 100%;
  height: 100%;
`;
