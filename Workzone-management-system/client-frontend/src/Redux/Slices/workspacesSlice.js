import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workspacesData: {},
    pending: true,
    // backgroundImages: [
    //     "https://images.unsplash.com/photo-1636471815144-616b00e21f24",
    //     "https://images.unsplash.com/photo-1636467455675-46b5552af493",
    //     "https://images.unsplash.com/photo-1636412911203-4065623b94fc",
    //     "https://images.unsplash.com/photo-1636408807362-a6195d3dd4de",
    //     "https://images.unsplash.com/photo-1603932743786-9a069a74e632",
    //     "https://images.unsplash.com/photo-1636207608470-dfedb46c2380",
    //     "https://images.unsplash.com/photo-1603932978744-e09fcf98ac00",
    //     "https://images.unsplash.com/photo-1636207543865-acf3ad382295",
    //     "https://images.unsplash.com/photo-1597244211919-8a52ab2e40ea",
    // ],
    // smallPostfix:
    //     "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw3MDY2fDB8MXxjb2xsZWN0aW9ufDJ8MzE3MDk5fHx8fHwyfHwxNjM2NjUzNDgz&ixlib=rb-1.2.1&q=80&w=400",
    creating: false,
    members: [],
    selectedWorkspaceId: null, // New addition to store the selected workspace ID

};

const workspacesSlice = createSlice({
    name: "workspaces",
    initialState,
    reducers: {
        startFetchingWorkSpaces: (state) => {
            state.pending = true;
        },
        successFetchingWorkSpaces: (state, action) => {
            state.workspacesData = action.payload.workspaces;
            state.pending = false;
        },
        // deleteBoard: (state, action) => {
        //     state.boardsData = state.boardsData.filter(board => board._id !== action.payload);
        //     state.pending = false;
        // },

        failFetchingWorkSpaces: (state) => {
            state.pending = false;
        },
        startCreatingWorkSpace: (state) => {
            state.creating = true;
        },
        successCreatingWorkSpace: (state, action) => {
            state.workspacesData.push(action.payload);
            state.creating = false;
        },
        failCreatingWorkSpace: (state) => {
            state.creating = true;
        },
        setWorkspaceId: (state, action) => {
            state.selectedWorkspaceId = action.payload;
        },
        updateWorkspaceTitle: (state, action) => {
			state.name = action.payload;
		},
        updateWorkspaceDescription: (state, action) => {
			state.description = action.payload;
		},
        addWorspaceMembers: (state,action)=>{
			state.members = action.payload;
		},
        // updateWorkspaceMembers:
        reset:(state)=>{
            state=initialState;
        }
    },
});

export const {
    startFetchingWorkSpaces,
    successFetchingWorkSpaces,
    // deleteBoard,
    failFetchingWorkSpaces,
    startCreatingWorkSpace,
    successCreatingWorkSpace,
    failCreatingWorkSpace,
    setWorkspaceId,
    updateWorkspaceTitle,
    updateWorkspaceDescription,
    addWorspaceMembers,
    reset
} = workspacesSlice.actions;
export default workspacesSlice.reducer;
