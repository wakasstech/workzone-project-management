import React, { useEffect, useState } from "react";
import * as style from "./styled";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import * as common from "../../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { boardTitleUpdate } from "../../../../../Services/boardsService";
import RightDrawer from "../../../../Drawers/RightDrawer/RightDrawer";
import BasePopover from "../../../../Modals/EditCardModal/ReUsableComponents/BasePopover";
import InviteMembers from "../../../../Modals/EditCardModal/Popovers/InviteMembers/InviteMembers";
import { ClosedCaptionDisabledSharp } from "@mui/icons-material";

const TopBar = (props) => {
  const workspaceId = localStorage.getItem("workspaceId");
  const board = useSelector((state) => state.board);
  const [currentTitle, setCurrentTitle] = useState(board.title);
  const [showDrawer, setShowDrawer] = useState(false);
  const [invitePopover, setInvitePopover] = React.useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!board.loading) setCurrentTitle(board.title);
  }, [board.loading, board.title]);
  const handleTitleChange = () => {
    boardTitleUpdate(workspaceId, currentTitle, board.id, dispatch);
  };
  return (
    <style.TopBar>
      <style.LeftWrapper>
        {props.role === "admin" && (
          <style.InviteButton
            onClick={(event) => setInvitePopover(event.currentTarget)}
          >
            <PersonAddAltIcon />
            <style.TextSpan>Add Member</style.TextSpan>
          </style.InviteButton>
        )}
        {invitePopover && (
          <BasePopover
            anchorElement={invitePopover}
            closeCallback={() => {
              setInvitePopover(null);
            }}
            title="Invite Members"
            contents={
              <InviteMembers
              boardId ={board?.id}
                workspace={props.workspace}
                closeCallback={() => {
                  setInvitePopover(null);
                }}
              />
            }
          />
        )}

        <style.BoardNameInput
          placeholder="Board Name"
          value={currentTitle}
          onChange={(e) => {
            if (props.role === "admin") {
              setCurrentTitle(e.target.value);
            }
          }}
          onBlur={(e) => {
            if (props.role === "admin") {
              handleTitleChange(e);
            }
          }}
        />
      </style.LeftWrapper>

      <style.RightWrapper>
        <common.Button
          onClick={() => {
            setShowDrawer(true);
          }}
        >
          <MoreHorizIcon />
          <style.TextSpan>Show menu</style.TextSpan>
        </common.Button>
      </style.RightWrapper>
      <RightDrawer
        show={showDrawer}
        closeCallback={() => {
          setShowDrawer(false);
        }}
      />
    </style.TopBar>
  );
};

export default TopBar;
