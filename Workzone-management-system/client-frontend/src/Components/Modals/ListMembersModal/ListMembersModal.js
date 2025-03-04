import * as React from "react";
import Modal from "@mui/material/Modal";
import CardLoadingSvg from "../../../Images/cardLoading.svg";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { getCard } from "../../../Services/cardService";
import { sm, xs } from "../../../BreakPoints";
import AddToListModal from "./AddToListModal";
import { Avatar } from "@mui/material";

const Container = styled.div`
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff; /* Changed background color */
  border-radius: 8px; /* Rounded corners for a softer look */
  width: 40rem;
  min-height: 45vh;
  height: fit-content;
  margin: 3rem auto; /* Removed bottom margin */
  padding: 4rem 2rem 0rem 2rem; /* Increased padding for more space */
  position: relative;
  ${sm({
    width: "90%",
  })}
  ${xs({
    width: "98%",
  })}
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;

  flex-direction: row;
  ${xs({
    flexDirection: "column",
    gap: "1rem",
  })}
`;

const MainContainer = styled.div`
  flex: 3;
  min-height: 50vh;
  padding-right: 0.5rem;
  width: 100%;
  overflow-x: hidden;
  gap: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const MembersHeader = styled.h5`
  font-size: 1.3rem; /* Increased font size for emphasis */
  margin-bottom: 1rem; /* Added margin for separation */
`;

const AddToCardContainer = styled.div`
  flex: 1;
  ${xs({
    marginTop: "1rem" /* Added margin for separation */,
  })}
`;

const LoadingScreen = styled.div`
  background-image: url(${(props) => props.image});
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
`;

const MemberName = styled.div`
  margin-left: 1rem; /* Added margin for separation */
`;
const Role = styled.span`
  font-size: 0.75rem;
  color: orange;
  marginleft: 1rem;
`;

const MemberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem; /* Added margin for separation */
  // border: 1px solid #ccc; /* Add a border for separation */
  padding: 0.5rem; /* Add some padding for spacing */
  border-radius: 8px; /* Add rounded corners for a softer look */
  background-color: #f9f9f9; /* Add a background color */
`;
const CloseIconWrapper = styled.div`
  position: absolute;
  top: 0.8rem; /* Adjusted top position */
  right: 0.8rem; /* Adjusted right position */
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1); /* Added a subtle background */
  &:hover {
    background-color: rgba(0, 0, 0, 0.2); /* Darker hover effect */
  }
`;

export default function ListMembersModal(props) {
  const members = useSelector((state) => {
    const list = state.list.allLists.find(
      (list) => list._id === props?.listInfo?._id
    );
    console.log("list in com", list);
    return list ? list.members : [];
  });
  console.log(members, "list members for `add in list`...");
  const workspaceId = localStorage.getItem("workspaceId");
  const { listId, boardId } = props.ids;
  const dispatch = useDispatch();
  const thisCard = useSelector((state) => state.card);
  // React.useEffect(() => {
  // 	if (props.open) {
  // 		getCard(workspaceId, cardId, listId, boardId, dispatch);
  // 	}
  // }, [boardId, cardId, dispatch, listId, props.open]);
  return (
    <div style={{ position: "relative" }}>
      <Modal
        open={props.open}
        onClose={props.callback}
        style={{ overflow: "auto" }}
      >
        <Container>
          <CloseIconWrapper onClick={props.callback}>
            <CloseIcon fontSize="small" color="black" />
          </CloseIconWrapper>
          <Wrapper>
            <MainContainer>
              {members && members.length > 0 ? (
                <div>
                  <p style={{ fontSize: "12px", fontStyle: "italic" }}>
                    Only individuals who are already board members may join the
                    list.
                  </p>
                  <MembersHeader>List Members</MembersHeader>
                  {members?.map((member, index) => (
                    <MemberContainer key={index}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          backgroundImage:
                            "linear-gradient(to  bottom, rgb(109,110,178), rgb(91,144,204))",
                          bgcolor: props.color,
                          fontSize: "0.875rem",
                          fontWeight: "800",
                        }}
                      >
                        {member?.name[0].toUpperCase()}
                      </Avatar>
                      <MemberName>
                        {`${member?.name} `}
                        {member?.role && (
                          <>
                            {" "}
                            &nbsp; 
                            <Role>({member.role})</Role>
                          </>
                        )}
                      </MemberName>
                    </MemberContainer>
                  ))}
                </div>
              ) : (
                <LoadingScreen image={CardLoadingSvg} />
              )}
            </MainContainer>

            <AddToCardContainer>
              <AddToListModal
                list={props?.listInfo?._id}
                board={boardId}
                members={members}
              />
            </AddToCardContainer>
          </Wrapper>
        </Container>
      </Modal>
    </div>
  );
}
