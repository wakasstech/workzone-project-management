import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {getWorkspaces} from "../Services/boardsService";
import {useHistory} from "react-router-dom";

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    gap: '0.25rem',
    padding: '0.25rem 0.5rem',
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:active': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
});

const Span = styled.span`
  font-size: 0.80rem;
  color:#626F86;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
  display: block;
  font-weight:bold;
`;

const StyledIcon = styled(DownIcon)({
    display: 'block',
    fontSize: '1.3rem',
});


export default function WorkspaceDropdown(props) {
    const history = useHistory();
    const workspaceId = useSelector((state) => state.workspaces.selectedWorkspaceId);
    const workspacesData = useSelector((state) => state.workspaces.workspacesData);

    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const open = Boolean(anchorEl);

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);
        setLoading(true);
        await getWorkspaces(true, dispatch); // Modify this according to your workspace fetching logic
        setLoading(false);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div > {/* Apply conditional border here */}
            <BootstrapButton
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Span>{props.title}</Span>
                <Span>
                    <StyledIcon />
                </Span>
            </BootstrapButton>
            {workspacesData.length > 0 && (
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                   
                    
                >
                    {loading ? (
                        <MenuItem>Loading...</MenuItem>
                    ) : (
                        <div style={{
                        }}>
                        {
                        workspacesData.map((workspace) => (
                            <MenuItem
                       
                                key={workspace.id}
                                onClick={() => {
                                    console.log(workspace?._id, 'here waqas');
                                    setAnchorEl(null);
                                    localStorage.setItem('workspaceId', workspace._id);
                                    history.push(`/board/${workspace?._id}`);

                                }}
                                style={{color: 'rgb(106,117,183)', fontWeight:600, fontSize:14}}
                            >
                                🏢 {workspace.name}
                            </MenuItem>
                        ))
                    }
                    </div>
                    )}
                </Menu>
            )}
        </div>
    );
}
