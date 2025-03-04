
import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../Navbar";
import { Container, Wrapper } from "./Style"
import { useHistory } from "react-router-dom";
import TestSidebar from "../../TestSidebar";
import Avatar from "@mui/material/Avatar";
import Loader from "../../Loader";

import { styled } from '@mui/material/styles';
import myStyled from "styled-components";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Modal, { modalClasses } from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { sm, xs } from '../../../BreakPoints';
import { Close } from '@mui/icons-material';
import { Box } from "@mui/material";
import { successFetchingUsers, updateUserRole } from "../../../Redux/Slices/userSlice";



const Containeer = myStyled.div`
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 8px;
  width: 40rem;
  min-height: 35vh;
  height: fit-content;
  margin: 3rem auto;
  padding: 3rem 2rem 3rem 2rem;
  position: relative;
  // overflow-x: auto;  /* Added horizontal scroll */
  // overflow-y: auto;
  max-height: 60vh;
  ${sm({
    width: "90%",
  })}
  ${xs({
    width: "98%",
  })}
`;

const CloseIconWrapper = myStyled.div`
  position: absolute;
  top: 0.8rem; /* Adjusted top position */
  right: 0.8rem; /* Adjusted right position */
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1); /* Added a subtle background */
  &:hover {
    background-color: rgba(0, 0, 0, 0.2); /* Darker hover effect */
  }
`;

const MainContainer = myStyled.div`
  flex: 3;
  min-height: 50vh;
  padding-right: 0.5rem;
  width: 100%;
  gap: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
`;
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#5663ab',
    padding: '10px 20px',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '15px 15px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AllUsers = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.user.users);

  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [searchString, setSearchString] = useState("");

  // const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newUserType, setNewUserType] = useState('');



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://taskmanagement.ranaafaqali.com/api/user/get-all-users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        dispatch(successFetchingUsers(data)); // Dispatch the action to update users in Redux store
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch]);



  const handleEditRoleClick = (user) => {
     console.log(user, 'user ')
    setSelectedUser(user);
    setNewUserType(user?.userType.toLowerCase());
    setOpenModal(true);
  };

  const handleUpdateRole = async () => {
    try {
      const response = await fetch('https://taskmanagement.ranaafaqali.com/api/user/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          id: selectedUser._id,
          userType: newUserType
        })
      });

      const data = await response.json();
      dispatch(updateUserRole({ userId: selectedUser._id, userType: newUserType })); // Dispatch the action to update user role in Redux store

      setOpenModal(false);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };


  useEffect(() => {
    document.title = "User Management";
  }, []);

  return (
    <>
      <Box>
        <TestSidebar />
        <Navbar
          searchString={searchString}
          spaces={"spaces"}
          setSearchString={setSearchString}
        />
     
        <Wrapper >
        <div >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {usersData.map((user) => (
              <StyledTableRow key={user._id}>
                <StyledTableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar style={{ width: '28px', height: '28px', marginRight: 4 }}>
                 <PersonIcon fontSize='11px'/>
                   </Avatar>
                    {`${user.name}`}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar style={{ width: '28px', height: '28px', marginRight: 4 }}>
                      <EmailIcon fontSize='10px'/>
                    </Avatar>
                    {user.email}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar style={{ width: '28px', height: '28px', marginRight: 4 }}>
                      <SupervisorAccountIcon fontSize='13px'/>
                    </Avatar>
                    {user.userType}
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <Button  style={{background: 'linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204))', color: 'white'}} onClick={() => handleEditRoleClick(user)}>
                    Edit Role
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Modal
       open={openModal} onClose={() => setOpenModal(false)}
        style={{ overflow: "auto" }}
      >
        <Containeer>
          <CloseIconWrapper onClick={() => setOpenModal(false)}>
            <Close fontSize="small" color="black" />
          </CloseIconWrapper>
            <MainContainer>
            <div style={{marginTop: 10}}>
          <h4>Edit User Role</h4>
          <p style={{fontSize: 12, color: '#4272df', fontStyle: 'italic'}}>Select Role*</p>
         <FormControl fullWidth sx={{padding: '0px 0px 100px 0px'}} >
        <Select
          value={newUserType}
          onChange={(e) => setNewUserType(e.target.value)}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="team member">Team Member</MenuItem>
          <MenuItem value="quality assurance">Quality Assurance</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <button style={{ background: 'linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204))', color: 'white', borderRadius: '5px', border: 'none', width: '100px', padding: '8px' }} onClick={handleUpdateRole}>Update</button>
      {/* {loader && <Loader/>} */}
      </div>
        </div>
            </MainContainer>
            </Containeer>
            </Modal>
  
    </div>
        </Wrapper>
      </Box>
      {loader && <Loader />} 
    </>
  );
};

export default AllUsers;




