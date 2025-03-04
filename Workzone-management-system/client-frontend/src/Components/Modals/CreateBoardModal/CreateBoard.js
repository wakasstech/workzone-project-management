import * as React from "react";
import Modal from "@mui/material/Modal";
import * as style from "./Styled";

import PhotoCardComponent from "./PhotoCardComponent";
import TitleCardComponent from "./TitleCardComponent";
import { useDispatch, useSelector } from "react-redux";
import {createBoard, getBoards} from "../../../Services/boardsService";
import LoadingScreen from "../../LoadingScreen";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Box, styled } from "@mui/material";

export default function CreateBoard(props) {
  const history = useHistory();
  const workspaceId = localStorage.getItem('workspaceId');
  const dispatch = useDispatch();
  const creating = useSelector((state) => state.boards.creating);
  const { backgroundImages, smallPostfix } = useSelector(
    (state) => state.boards
  );

  const [open, setOpen] = React.useState(true);

  const [background, setBackground] = React.useState(
    backgroundImages[0] + smallPostfix
  );
  let newBoard = {};
  console.log(newBoard);
  const handleClick = async () => {
    await createBoard(newBoard, workspaceId, dispatch);
    props.callback();
    setBackground(backgroundImages[0] + smallPostfix);
    getBoards(false,dispatch, workspaceId);
    history.push(`/board/${workspaceId}`)
  };

  const handleSelect = (link) => {
    setBackground(link);
  };

  const handleClose = () => {
    setOpen(false);
    props.callback();
  };

  const handleUpdate = (updatedBoard) => {
    newBoard = { ...updatedBoard };
  };
  const MarqueeBox = styled("div")({
    // backgroundColor: "#f5f5f5",
    cursor: 'pointer',
    // textAlign: 'center',
    color: "#32305B",
    // padding: "2px 16px",
    borderRadius: "8px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    fontSize: "10px",
    fontWeight: "bold",
    marginBottom: "10px",
    fontFamily: 'cursive',
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      width: "100%",
      height: "100%",
      animation: "marquee 5s linear infinite",
      background: "linear-gradient(to right, rgba(245, 245, 245, 0), rgba(245, 245, 245, 1))",
    },
    "@keyframes marquee": {
      from: { transform: "translateX(100%)" },
      to: { transform: "translateX(-100%)" },
    },
  });
  return (
    <div style={{ position: "relative", background: 'white' }}>
      {creating && <LoadingScreen />}
      <Modal open={open} onClose={handleClose} disableEnforceFocus >
        <style.Container sx={{}}>
          <MarqueeBox>Choose an image from right-hand picture options for background</MarqueeBox>
          
          <style.Wrapper>
            <TitleCardComponent
              link={background}
              updateback={handleUpdate}
              callback={handleClose}
            />
            <style.PhotosCard>
              {backgroundImages.map((item, index) => {
                return (
                  <PhotoCardComponent
                    key={index}
                    selectedLink={background}
                    link={item + smallPostfix}
                    callback={handleSelect}
                  />
                );
              })}
            </style.PhotosCard>
          </style.Wrapper>

          <Box sx={{display: 'flex', flexDirection: 'row',  gap:2, marginTop:2}}>
          <style.CreateButton onClick={() => handleClick()}>
            Create Board
          </style.CreateButton>
          <style.CancelButton  onClick={handleClose}>
            Cancel
          </style.CancelButton>
       
          </Box>
          </style.Container>
      </Modal>
    </div>
  );
}
