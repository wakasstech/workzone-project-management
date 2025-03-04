import React from "react";
import styled from "styled-components";
import DropdownMenu from "./DropdownMenu";
import SearchBar from "./SearchBar";
import { xs } from "../BreakPoints";
import ProfileBox from "./ProfileBox";
import { useHistory } from "react-router-dom";
import CreateMenu from "./CreateMenu";
import WorkspaceDropdown from "./WorkspaceDropdown";
import LOGO from "../Images/designLogo.png";
import { GroupAddOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import SendInvitation from "./Modals/SendInvitation/SendInvitation";

const Container = styled.div`
  height: 3rem;
  border-bottom: 1px solid #dcdcdc; /* Add this line to set a border bottom */
  width: 100%;
  background-color: 'rgba(0, 0, 0, 0.3)';
  //background-color: 'red';
  backdrop-filter: blur(24px);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  ${xs({
    padding: "0.5rem, 0rem",
  })}
`;

const LeftSide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  ${xs({
    gap: "0.1rem",
    width: "fit-content",
  })}
`;

const RightSide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TrelloLogo = styled.img`
 width: 75px;
 height: 15px;
 cursor: pointer;
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
 
  justify-content: flex-start;
  ${xs({
    display: "none",
  })}
`;

const Navbar = (props) => {
  console.log(props.role , 'propssssssssss')
  const history = useHistory();

  return (
    <Container style={{backgroundColor: 'white'}}>
      <LeftSide>
        <LogoContainer style={{marginTop: '2.5px'}}>
          <TrelloLogo
            onClick={() => {
              history.push("/workspaces");
            }}
            src={LOGO}
          />
        </LogoContainer>
        {props.spaces ? null : (
          <DropdownContainer>
            <DropdownMenu title="Your Boards" />
          </DropdownContainer>
        )}

        <DropdownContainer>
          <WorkspaceDropdown title="Your Workspaces" />
        </DropdownContainer>
        {props.boards && (
          <DropdownContainer>
            <DropdownMenu title="Your Boards" />
          </DropdownContainer>
        )}

        
{props?.role === 'admin' && <CreateMenu />}
{props?.role === 'admin' && <SendInvitation />}
           
       
      </LeftSide>
      <RightSide>
        <SearchBar
          searchString={props.searchString}
          setSearchString={props.setSearchString}
        />
        <ProfileBox />
      </RightSide>
    </Container>
  );
};

export default Navbar;
