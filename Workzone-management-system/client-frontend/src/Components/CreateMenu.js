import React, { useState } from 'react';
import {Button, IconButton, Menu, Box, useTheme, Typography} from '@mui/material';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import PeopleIcon from '@mui/icons-material/People';
import { useMediaQuery } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import CreateWorkspaceModal from './Modals/CreateWorkspaceModal/CreateWorkspaceModal';

const MenuItem = styled('div')(({ theme }) => ({
    display: 'flex',
}));
function CreateMenu({flag}) {
   console.log(flag, 'sdsac')
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    // const [isCreateBoardModalOpen, setCreateBoardModalOpen] = useState(false);
    const [isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen] = useState(false); // New state for workspace modal

    // const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    // const openCreateBoardModal = () => {
    //     handleMenuClose(); // Close the main menu
    //     // setCreateBoardModalOpen(true);
    // };
    // const closeCreateBoardModal = () => {
    //     setCreateBoardModalOpen(false);
    // };
    const openCreateWorkspaceModal = () => {
        handleMenuClose();
        setCreateWorkspaceModalOpen(true); // Open the workspace modal
    };

    const closeCreateWorkspaceModal = () => {
        setCreateWorkspaceModalOpen(false); // Close the workspace modal
    };


    const createMenuItems = [
     //   { title: 'Create Board', description: <p style={{whitespace:"unset !important"}}>A board is made up of cards ordered on lists. Use it to manage projects, track information, or organize anything.</p>, icon: <LeaderboardOutlinedIcon/>,  },
        { title: ' Create WorkSpace', description: <p>Create A Workspace is a group of
                boards and people. Use it to organize your company,
                side hustle, family, or friends.</p>, icon: <PeopleIcon/> ,   onClick: openCreateWorkspaceModal,
        },
        // Add more create options as needed
    ];

    return (
        <>

{isSmallScreen ? <Add style={{fontSize:20,borderRadius: 20,  color: 'white', marginRight: 6, marginLeft:10 }} onClick={handleButtonClick}/>

:

            <Button
                style={{
                    backgroundImage: flag === 'sidebar' ? 'white' : 'linear-gradient(to  bottom, rgb(109,110,178), rgb(91,144,204))',
                    // minWidth: flag === 'sidebar' ? '36px' : '20px', // Set 'auto' or the default width when flag is not 'sidebar'
                    // height: flag === 'sidebar' ? '25px' : '31px', // Set 'auto' or the default height when flag is not 'sidebar'
                    color: 'white',
                    marginBottom: flag==='sidebar' ? "2px" : "0px" ,
                    padding: '1px 4px',
                    '&:hover': {
                         backgroundColor: 'grey',
                    }
                }}

                onClick={handleButtonClick}
            >
                <Typography sx={{  marginLeft: flag==='sidebar' ? "12px" : "0px" ,fontWeight: flag==='sidebar' ? "800" : "", fontSize: flag==='sidebar' ? "22px" : "15px", color:  flag==='sidebar' ? "#525654" : "white", textTransform: 'capitalize',fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif'}}>
                {
                    flag==='sidebar' ? (
                 `+`
                ) : (
                    isSmallScreen ? <Add sx={{fontSize:12 }}/> : 'Create'
                )
                }
             </Typography>
                {/*{flag === 'sidebar' ? '+' : isSmallScreen ? <Add /> : 'Create'}*/}

            </Button>}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {createMenuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={item.onClick ? item.onClick : handleMenuClose}
                        sx={{
                            maxWidth: '350px',
                            '&:hover': {
                                backgroundColor: '#999',
                            },
                        }}
                    >
                        <Box>
                            <Box display="flex" position="relative">
                                <span>{item.icon}</span>
                                <span className="span1">{item.title}</span>
                            </Box>
                            <Box sx={{ px: '10px' }}>{item.description}</Box>
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
            {/*<CreateBoardModal open={isCreateBoardModalOpen} onClose={closeCreateBoardModal} />*/}
            <CreateWorkspaceModal open={isCreateWorkspaceModalOpen} onClose={closeCreateWorkspaceModal} /> {/* Render the workspace modal */}

        </>
    );
}
export default CreateMenu;
