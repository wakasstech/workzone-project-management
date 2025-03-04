import axios from "axios";
import { openAlert } from "../Redux/Slices/alertSlice";
import {
  failFetchingBoards,
  startFetchingBoards,
  successFetchingBoards,
  deleteBoard,
  successCreatingBoard,
  failCreatingBoard,
  startCreatingBoard,
} from "../Redux/Slices/boardsSlice";
import { addNewBoard } from "../Redux/Slices/userSlice";
import {
  setLoading,
  successFetchingBoard,
  updateTitle,
} from "../Redux/Slices/boardSlice";
import {
  updateWorkspaceDescription,
  updateWorkspaceTitle,
} from "../Redux/Slices/workspacesSlice";
import {
  failFetchingWorkSpaces,
  startFetchingWorkSpaces,
  successFetchingWorkSpaces,
} from "../Redux/Slices/workspacesSlice";
const baseUrl = "https://taskmanagement.ranaafaqali.com/api/board";
const baseUrlWorkspaces = "https://taskmanagement.ranaafaqali.com/api/workspace/get-workspaces";
const baseUrlWorkspace = "https://taskmanagement.ranaafaqali.com/api/workspace";
export const createWorkspace = async (workspaceData) => {
  try {
    const res = await axios.post(`${baseUrlWorkspace}/create`, workspaceData);
    return res.data; // Assuming the server returns the newly created workspace data
  } catch (error) {
    throw error; // Handle the error in the component or other service functions
  }
};
export const getWorkspaces = async (fromDropDown, dispatch) => {
  if (!fromDropDown) dispatch(startFetchingWorkSpaces());
  try {
    const res = await axios.get(baseUrlWorkspaces + "/");
    setTimeout(() => {
      dispatch(successFetchingWorkSpaces({ workspaces: res.data }));
    }, 1000);
  } catch (error) {
    dispatch(failFetchingWorkSpaces());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};
export const workspaceTitleUpdate = async (name, workspaceId, dispatch) => {
  try {
    dispatch(updateWorkspaceTitle(name));
    await axios.put(
      baseUrlWorkspace + "/update-workspaceName" + "/" + workspaceId,
      { name: name }
    );
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};
export const workspaceDescriptionUpdate = async (
  description,
  workspaceId,
  dispatch
) => {
  try {
    dispatch(updateWorkspaceDescription(description));
    await axios.put(
      baseUrlWorkspace + "/update-workspaceDescription" + "/" + workspaceId,
      { description: description }
    );
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};

export const getBoards = async (fromDropDown, dispatch, workspaceId) => {
  if (!fromDropDown) dispatch(startFetchingBoards());
  try {
    const res = await axios.get(baseUrl + `/${workspaceId}`);
    setTimeout(() => {
      dispatch(successFetchingBoards({ boards: res.data }));
    }, 1000);
  } catch (error) {
    dispatch(failFetchingBoards());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};

export const createBoard = async (props, workspaceId, dispatch) => {
  dispatch(startCreatingBoard());
  if (!(props.title && props.backgroundImageLink)) {
    dispatch(failCreatingBoard());
    dispatch(
      openAlert({
        message: "Please enter a title for board!",
        severity: "warning",
      })
    );
    return;
  }
  try {
    const res = await axios.post(baseUrl + "/create", {
      ...props,
      workspaceId,
    });
    dispatch(addNewBoard(res.data));
    dispatch(successCreatingBoard(res.data));
    dispatch(
      openAlert({
        message: `${res.data.title} board has been successfully created`,
        severity: "success",
      })
    );
  } catch (error) {
    dispatch(failCreatingBoard());
    // dispatch(
    //   openAlert({
    //     message: error?.response?.data?.errMessage
    //       ? error.response.data.errMessage
    //       : error.message,
    //     severity: "error",
    //   })
    // );
  }
};

export const handleDeleteBoardById = async (
  workspaceId,
  event,
  boardToDelete,
  dispatch,
  setBoardToDelete,
  handleCloseConfirmation
) => {
  try {
    if (boardToDelete) {
      await axios.delete(
        `https://taskmanagement.ranaafaqali.com/api/board/${workspaceId}/${boardToDelete}`
      );
      dispatch(deleteBoard(boardToDelete));
      setBoardToDelete(null);
    }
    handleCloseConfirmation();
  } catch (error) {
    dispatch(failCreatingBoard());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};

export const getBoard = async (boardId, dispatch, workspaceId) => {
  dispatch(setLoading(true));
  try {
    const url = `${baseUrl}/${workspaceId}/${boardId}`;

    const res = await axios.get(url);
    dispatch(successFetchingBoard(res.data));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};

export const boardTitleUpdate = async (
  workspaceId,
  title,
  boardId,
  dispatch
) => {
  try {
    dispatch(updateTitle(title));
    await axios.put(
      baseUrl + "/" + workspaceId + "/" + boardId + "/update-board-title",
      { title: title }
    );
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};



