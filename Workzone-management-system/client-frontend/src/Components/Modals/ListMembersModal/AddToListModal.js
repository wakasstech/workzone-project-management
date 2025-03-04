import React from "react";
import ListMembersPopover from "./ListMembersPopover";
import Button from "../EditCardModal/ReUsableComponents/IconButton";
import MemberIcon from "@mui/icons-material/PersonOutlineOutlined";
import BasePopover from "../EditCardModal/ReUsableComponents/BasePopover";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 3px;
  width: 100%;
  gap: 0.5rem;
  padding: 0rem 1rem 1rem 1rem;
`;
const Title = styled.div`
  color: #5e6c84;
  font-size: 0.90rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AddToListModal = (props) => {
  const [memberPopover, setMemberPopover] = React.useState(null);

  return (
    <Container>
      <Title>Add to list</Title>
      <p style={{fontSize: '11px', color: 'rgb(94, 108, 132)'}}>Click the button below to add a member to the list.</p>
      <Button
        clickCallback={(event) => setMemberPopover(event.currentTarget)}
        title="Members"
        icon={<MemberIcon fontSize="small" />}
      ></Button>
      {memberPopover && (
        <BasePopover
          anchorElement={memberPopover}
          closeCallback={() => {
            setMemberPopover(null);
          }}
          title="Members"
          contents={<ListMembersPopover list={props.list} board={props.board} listMembers={props.members}/>}
        />
      )}
    </Container>
  );
};

export default AddToListModal;
