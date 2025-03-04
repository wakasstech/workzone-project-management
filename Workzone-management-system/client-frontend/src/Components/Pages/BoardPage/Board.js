import Navbar from "../../Navbar";
import React, { useEffect, useState } from "react";
import TopBar from "./BoardComponents/TopBar/TopBar";
import * as style from "./Styled";
import AddList from "./BoardComponents/AddList/AddList";
import List from "./BoardComponents/List/List";
import { useDispatch, useSelector } from "react-redux";
import { getBoard } from "../../../Services/boardsService";
import { getLists } from "../../../Services/boardService";
import {
  updateCardOrder,
  updateListOrder,
} from "../../../Services/dragAndDropService";
import LoadingScreen from "../../LoadingScreen";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Sidebar from "../../Sidebar/Sidebar";
import Loader from "../../Loader";

const Board = (props) => {
  const workspacesData = localStorage.getItem("workspacesData");
  console.log(workspacesData, 'at board workspacesData..............');
  const [loader, setLoader] = useState(false);
  /* props.match.params.id */
  const dispatch = useDispatch();
  const { backgroundImageLink, isImage, loading, title } = useSelector(
    (state) => state.board
  );
  const { allLists, loadingListService } = useSelector((state) => state.list);
  
  const {userInfo} = useSelector((state) => state.user);
  const userRole = userInfo?.userType;
  console.log(userRole, 'userrrrrrrRoleeeeee....')
  const [searchString, setSearchString] = useState("");

  const workspaceId = localStorage.getItem("workspaceId");
  const workspace = localStorage.getItem("workspace");
  console.log(workspaceId, "active-workspace");
  const boardId = props.match.params.boardId;

  // useEffect(() => {
  //   getBoard(boardId, dispatch, workspaceId);
  //   getLists(boardId, dispatch, workspaceId);
  // }, [props.match.params.boardId, dispatch, boardId]);

  useEffect(() => {
    setLoader(true);

    getBoard(boardId, dispatch, workspaceId)
      .then(() => {
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching board:", error);
        setLoader(false);
      });
  
    getLists(boardId, dispatch, workspaceId)
      .then(() => {
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching lists:", error);
        setLoader(false);
      });
  }, [props.match.params.boardId, dispatch, boardId, workspaceId]);


  useEffect(() => {
    document.title = title + " | Board";
  }, [title]);


 
  const onDragEnd = async (result) => {

    // setLoader(true);
     
    const { draggableId, source, destination } = result;
      // Console log the types of draggableId and droppableIds
      console.log('Type of draggableId:', typeof draggableId);
      console.log('Type of source.droppableId:', typeof source.droppableId);
      console.log('Type of destination.droppableId:', typeof destination.droppableId);
    if (!destination || !draggableId || typeof draggableId !== 'string' || typeof source.droppableId !== 'string' || typeof destination.droppableId !== 'string') {
      return;
    }
  
    // if (result.type === "column") {
    //   if (source.index === destination.index) {
    //     setLoader(false);
    //     return;
    //   }
  
    //   await updateListOrder(
    //     {
    //       sourceIndex: source.index,
    //       destinationIndex: destination.index,
    //       listId: draggableId,
    //       boardId: boardId,
    //       workspaceId: workspaceId,
    //       allLists: allLists,
    //     },
    //     dispatch
    //   );
  
    //   setLoader(false);
    //   return;
    // }
  
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      setLoader(false);
      return;
    }
  
    await updateCardOrder(
      {
        sourceId: source.droppableId,
        destinationId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        cardId: draggableId,
        boardId: boardId,
        workspaceId: workspaceId,
        allLists: allLists,
      },
      dispatch
    );
  
    setLoader(false);
  };

  
  return (
    <>
      <Sidebar workspaceId={workspaceId} />{" "}
      {/* Include the Sidebar component */}
      <Navbar searchString={searchString} setSearchString={setSearchString} />
      <style.Container
        isImage={isImage}
        bgImage={
          isImage ? backgroundImageLink.split("?")[0] : backgroundImageLink
        }
      >
        <TopBar workspace={workspacesData} role={userRole} />
        {(loading || loadingListService) && <LoadingScreen />}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided, snapshot) => {
              return (
                <style.ListContainer
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {!loading &&
                    allLists.map((list, index) => {
                      return (
                      
                        <List
                          workspaceId={workspaceId}
                          searchString={searchString}
                          key={list._id}
                          index={index}
                          info={list}
                          boardId={boardId}
                          role={userRole}
                        />
                      );
                    })}
                  {provided.placeholder}
                  {userRole === 'admin' &&
                  <AddList boardId={boardId} workspaceId={workspaceId} />
            }
                </style.ListContainer>
              );
            }}
          </Droppable>
        </DragDropContext>
      </style.Container>
      {loader && <Loader/>}
    </>
  );
};

export default Board;
