import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boardsData: {},
  pending: true,
  backgroundImages: [
    "https://images.unsplash.com/photo-1693491012999-09a3764eab33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDN8MzE3MDk5fHx8fHwyfHwxNjk0NTE2MjU4fA&ixlib=rb-4.0.3&q=80&w=400&quot",
    "https://images.unsplash.com/photo-1694900565922-d279cef76fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDR8MzE3MDk5fHx8fHwyfHwxNjk1MjA0OTQ2fA&ixlib=rb-4.0.3&q=80&w=400&quot",
    "https://images.unsplash.com/photo-1636412911203-4065623b94fc",
    "https://images.unsplash.com/photo-1636408807362-a6195d3dd4de",
    "https://images.unsplash.com/photo-1695056721216-dbf554a091a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDV8MzE3MDk5fHx8fHwyfHwxNjk1MjA0OTQ2fA&ixlib=rb-4.0.3&q=80&w=400&quot",
    "https://buffer.com/resources/content/images/wp-content/uploads/2018/06/jason-leung-479251-unsplash.jpg",
   
    "https://images.unsplash.com/photo-1485356824219-4bc17c2a2ea7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHJlbGxvfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1636207543865-acf3ad382295",
    "https://images.unsplash.com/photo-1597244211919-8a52ab2e40ea",
  ],
  smallPostfix:
    "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3MDY2fDB8MXxjb2xsZWN0aW9ufDJ8MzE3MDk5fHx8fHwyfHwxNjM2NjUzNDgz&ixlib=rb-1.2.1&q=80&w=400",
  creating: false,
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    startFetchingBoards: (state) => {
      state.pending = true;
    },
    successFetchingBoards: (state, action) => {
      state.boardsData = action.payload.boards;
      state.pending = false;
    },

    deleteBoard: (state, action) => {
      state.boardsData = state.boardsData.filter(board => board._id !== action.payload);
      state.pending = false;
    },

    failFetchingBoards: (state) => {
      state.pending = false;
    },
    startCreatingBoard: (state) => {
      state.creating = true;
    },
    successCreatingBoard: (state, action) => {
      state.boardsData.push(action.payload);
      state.creating = false;
    },
    failCreatingBoard: (state) => {
      state.creating = true;
    },
    reset:(state)=>{
      state=initialState;
    }
  },
});

export const {
  startFetchingBoards,
  successFetchingBoards,
  deleteBoard,
  failFetchingBoards,
  startCreatingBoard,
  successCreatingBoard,
  failCreatingBoard,
  reset
} = boardsSlice.actions;
export default boardsSlice.reducer;
