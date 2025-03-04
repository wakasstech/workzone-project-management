import React, { useEffect, useRef, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {
  AddTitleCardContainer,
  CardContainer,
  CardWrapper,
  Container,
  FooterButton,
  Header,
  Span,
  TitleInput,
  TitlePlaceholder,
  TitleNewCardInput,
} from "./styled";
import { ClickableIcon } from "../../CommonStyled";
import BottomButtonGroup from "../BottomButtonGroup/BottomButtonGroup";
import Card from "../Card/Card";
import { useDispatch, useSelector } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  DeleteList,
  listTitleUpdate,
} from "../../../../../Services/boardService";
import { createCard } from "../../../../../Services/listService";
import { Droppable, Draggable } from "react-beautiful-dnd";
import EditCard from "../../../../Modals/EditCardModal/EditCard";
import ListMembersModal from "../../../../Modals/ListMembersModal/ListMembersModal";
import Swal from "sweetalert2";
import { openAlert } from "../../../../../Redux/Slices/alertSlice";

const List = (props) => {
  console.log(props, 'list propssssss')
  const dispatch = useDispatch();
  const workspaceId = localStorage.getItem("workspaceId");

  const { userInfo } = useSelector((state) => state.user);
  const userRole = userInfo?.userType;
  const [openModal, setOpenModal] = useState(false);

  const [clickTitle, setClickTitle] = useState(false);
  const [clickFooter, setClickFooter] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [currentListTitle, setCurrentListTitle] = useState(props.info.title);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const ref = useRef();

  const handleOpenClose = () => {
    setOpenModal((current) => !current);
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFooterClick = async () => {
    setNewCardTitle("");
    await createCard(
      newCardTitle,
      props.info._id,
      props.boardId,
      dispatch,
      workspaceId
    );
    ref && ref.current && ref.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleFooterCloseClick = () => {
    setClickFooter(false);
    setNewCardTitle("");
  };

  const handleOnChangeTitle = (e) => {
   console.log(e.target.value);
    setCurrentListTitle(e.target.value);
  };

  const handleChangeTitle = async () => {
    if (props.info.title !== currentListTitle)
      await listTitleUpdate(
        workspaceId,
        props.info._id,
        props.info.owner,
        currentListTitle,
        dispatch
      );
  };

  const handleDeleteClick = () => {
    setAnchorEl(null)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6B5AE0", // Purple shade matching the image theme
      cancelButtonColor: "#4169E1", // Royal Blue shade matching the image theme
      confirmButtonText: "Yes, delete it!",
      background: "#1A1C39", // Darker background to match the image aesthetic
      color: "#fff", // White text for better contrast,
      willOpen: () => {
        document.querySelector(".swal2-icon").style.margin = "0 auto";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
      
          DeleteList(workspaceId, props.info._id, props.info.owner, dispatch);
            
      dispatch(
        openAlert({
          message: 'List deleted successfully',
          severity: 'success',
        })
      );
     
        } catch (error) {
          dispatch(
            openAlert({
              message: 'List not deleted successfully, something went wrong',
              severity: "error",
            })
          );
        }
      } 
    });
   
  };

  const handleClickOutside = (e) => {
    if (ref.current)
      if (!ref.current.contains(e.target)) {
        setClickFooter(false);
        setNewCardTitle("");
      }
  };

  const handleMemberClick = () => {
    alert("member");
    setAnchorEl(null);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    
    if (clickFooter) {
      ref.current.scrollIntoView();
    }
  }, [clickFooter]);

  return (
    <>
      <Draggable draggableId={props.info._id} index={props.index}>
        {(provided, snapshot) => {
          return (
            <Container
              {...provided.draggableProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              <Header
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
              >
                <TitlePlaceholder
                  show={clickTitle}
                  onClick={() => setClickTitle(true)}
                >
                  {currentListTitle}
                </TitlePlaceholder>
                <TitleInput
                  onBlur={() => {
					if (props.role === "admin") {
						setClickTitle(false);
                    handleChangeTitle();
					  }
                    
                  }}
                  ref={(input) => input && input.focus()}
                  show={clickTitle}
                  value={currentListTitle}
				  onChange={(e) => {
					if (props.role === "admin") {
						handleOnChangeTitle(e);
					}
				  }}

                />
				 {props.role === "admin" &&  
                <ClickableIcon
                  color="#656565"
                  aria-controls="basic-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <MoreHorizIcon fontSize="0.1rem" onClick={() => {}} />
                </ClickableIcon>
		}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleOpenClose}>
                    <ListItemIcon>
                      <PersonAddAltIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add Member</ListItemText>
                  </MenuItem>
                </Menu>
              </Header>
              <Droppable 
              droppableId={userRole === 'admin' ? String(props.info._id) : props.info._id} 
              direction="vertical">
                {(provided, snapshot) => {
                  return (
                    <CardContainer
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      <CardWrapper dock={clickFooter}>
                        {props.info.cards
                          .filter((card) =>
                            props.searchString
                              ? card.title
                                  .toLowerCase()
                                  .includes(props.searchString.toLowerCase())
                              : true
                          )
                          .map((card, index) => {
                            console.log (card, 'card valuessss')
                            return (
                              <Card
                                listInfo={props.info}
                                boardId={props.boardId}
                                listId={props.info._id}
                                key={card._id}
                                index={index}
                                info={card}
								userType={props.role}
                              />
                            );
                          })}
                        {provided.placeholder}
                        {clickFooter && (
                          <AddTitleCardContainer ref={ref}>
                            <TitleNewCardInput
                              value={newCardTitle}
                              autoFocus={true}
                              placeholder="Enter a title for this card..."
                              height={
                                Math.floor(newCardTitle.length / 16) + "rem"
                              }
                              onChange={(e) => setNewCardTitle(e.target.value)}
                            />
                            <BottomButtonGroup
                              title="Add card"
                              clickCallback={handleFooterClick}
                              closeCallback={handleFooterCloseClick}
                            />
                          </AddTitleCardContainer>
                        )}
                      </CardWrapper>
                    </CardContainer>
                  );
                }}
              </Droppable>

              {props.role === "admin" && !clickFooter && (
                <FooterButton onClick={() => setClickFooter(true)}>
                  <AddIcon fontSize="small" />
                  <Span>Add a card</Span>
                </FooterButton>
              )}
            </Container>
          );
        }}
      </Draggable>

      {openModal && (
        <ListMembersModal
          open={openModal}
          callback={handleOpenClose}
          ids={{ listId: props.listId, boardId: props.boardId }}
          listInfo={props.info}
        />
      )}
    </>
  );
};

export default List;
