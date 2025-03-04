import React, { useState } from 'react';
import prev from './workspacePrev.png';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Paper,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack, Close, Margin } from '@mui/icons-material';
import {
    failCreatingWorkSpace,
    startCreatingWorkSpace,
    successCreatingWorkSpace
} from "../../../Redux/Slices/workspacesSlice";
import {useDispatch} from "react-redux";
import {createWorkspace, getBoards} from "../../../Services/boardsService";
import {useHistory} from "react-router-dom";

const CreateWorkspaceModal = ({ open, onClose }) => {
    const history = useHistory();
    const [workspaceTitle, setWorkspaceTitle] = useState('');
    const [workspaceType, setWorkspaceType] = useState('');
    const [workspaceDescription, setWorkspaceDescription] = useState('');
    const dispatch = useDispatch();

    const handleWorkspaceTitleChange = (event) => {
        setWorkspaceTitle(event.target.value);
    };

    const handleWorkspaceTypeChange = (event) => {
        setWorkspaceType(event.target.value);
    };

    const handleWorkspaceDescriptionChange = (event) => {
        setWorkspaceDescription(event.target.value);
    };
const workspaceData = {
    name: workspaceTitle,
    type: workspaceType,
    description: workspaceDescription
};
    const handleCreateWorkspace = async () => {
        dispatch(startCreatingWorkSpace());

        try {
            const newWorkspace = await createWorkspace(workspaceData);
            dispatch(successCreatingWorkSpace(newWorkspace));
            history.push('/workspaces');
            // Make sure newWorkspace contains the _id property from the API response
            // if (newWorkspace._id) {
            //     const workspaceId = newWorkspace._id;
            //     getBoards(false,dispatch, workspaceId);


                // Close the modal after navigation
                onClose();
            // }

            // Additional success logic or alerts can be dispatched here
        } catch (error) {
            dispatch(failCreatingWorkSpace());
            // Handle the error, maybe show an alert or log it
        }
    };


    const handleBackAndClose = () => {
        onClose(); // Close the modal
        // Add any additional logic you need for navigating back
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                width: '100%',
                maxWidth: '1300px', // Set the maximum width for the modal
                margin: '0',
            }}
        >
            <Box sx={{ display: 'flex',
                flexDirection: 'column-reverse',}}>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',

                        '& .MuiDialogContent-root': {
                            padding: '0 !important', // Setting padding to '0' will remove the default padding
                        },
                    }}
                >
                    {/* Workspace Details */}
                    <Box
                        sx={{
                            marginBottom: '20px',
                        }}
                    >
                        <TextField
                            label="Workspace Name"
                            fullWidth
                            value={workspaceTitle}
                            onChange={handleWorkspaceTitleChange}
                        />
                    </Box>
                    <Box
                        sx={{
                            marginBottom: '20px',
                        }}
                    >
                        <Select
                            value={workspaceType}
                            onChange={handleWorkspaceTypeChange}
                            variant="outlined"
                            fullWidth
                        >
                            <MenuItem value="personal">Personal Workspace</MenuItem>
                            <MenuItem value="team">Team Workspace</MenuItem>
                        </Select>
                    </Box>
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={workspaceDescription}
                        onChange={handleWorkspaceDescriptionChange}
                        sx={{
                            marginBottom: '20px',
                        }}
                    />

                    {/* Create Button */}
                    <Button onClick={handleCreateWorkspace} variant="outlined" fullWidth>
                        Create
                    </Button>
                </DialogContent>
                {/* Workspace Preview */}
                <Box
                    sx={{
                        width: '100%',
                        height: '250px', // Set a fixed height for the preview on mobile and medium screens
                        backgroundColor: '#f0f8ff',
                    }}
                >
                    <img
                        src={prev}
                        alt="Workspace Preview"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
            </Box>
        </Dialog>
    );
};

export default CreateWorkspaceModal;
