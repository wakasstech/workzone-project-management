import React, { useState } from 'react'
import { SmallColorBox } from '../EditCardModal/Popovers/Labels/styled'
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import { GroupAddOutlined } from '@mui/icons-material';
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { md, sm, xs } from '../../../BreakPoints';
import Loader from '../../Loader';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { openAlert } from '../../../Redux/Slices/alertSlice';
import { logout } from '../../../Redux/Slices/userSlice';

const FormSection = styled.section`
display: block;
word-wrap: break-word;
`;
const FormCard = styled.div`
box-sizing: border-box;
display: block;
max-width: 400px;
width: fit-content;
margin: 0 auto;
position: relative;
background-color: #ffffff;
border-radius: 3px;
padding: 1.5rem 2.5rem;
box-shadow: rgb(0 0 0 / 10%) 0 0 10px;

${md({
  maxWidth: "100%",
  width: "100%",
  boxShadow: "none",
  backgroundColor: "#F9FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: "0.5rem 1rem",
})}
`;
const Form = styled.form`
display: flex;
flex-direction: column;
width: 20rem;
justify-content: center;
align-items: center;
gap: 1rem;
${md({
  gap: "0.7rem",
})}
`;
const Title = styled.h1`
color: #5e6c84;
font-size: 14px;
padding: 20px;
`;

const Input = styled.input`
margin-top: 30px;
width: 100%;
outline: none;
font-size: 0.85rem;
border-radius: 0.2rem;
padding: 0.6rem;
border: 2px solid #dfe1e6;
background-color: #fafbfc;
&:focus {
  transition: background-color 0.2s ease-in-out 0s,
    border-color 0.2s ease-in-out 0s;
  border: 2px solid #68bcff;
}
`;
const Click = styled.button`
background-color: orangered;
margin-top: 10px;
width: 100%;
border-radius: 0.4rem;
padding: 0.5rem 1rem;
color: white;
border: none;
cursor: pointer;
font-weight: bold;
&:hover {
  background: linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204));
}
`;
const Hr = styled.hr`
width: 100%;
display: block;
height: 1px;
border: 0;
border-top: 1px solid hsl(0, 0%, 80%);
margin: 0.5 0;
padding: 0;
`;

const Link = styled.a`
text-decoration: none;
color: #0052cc;
cursor: pointer;
font-size: ${(props) => props.fontSize};
&:hover {
  color: #0052cc;
}
`;

const MainContainer = styled.div`
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
const Container = styled.div`
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 8px;
  width: 40rem;
  min-height: 45vh;
  height: fit-content;
  margin: 3rem auto;
//   padding: 3rem 2rem 3rem 2rem;
  position: relative;
  overflow-x: auto;  /* Added horizontal scroll */
  overflow-y: auto;
  max-height: 80vh;
  ${sm({
    width: "90%",
  })}
  ${xs({
    width: "98%",
  })}
`;
const CloseIconWrapper = styled.div`
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

const SendInvitation = () => {
  const dispatch = useDispatch();
   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(788)); // Modify the breakpoint as needed

    const [openModal, setOpenModal] = React.useState(false);
    const [loader, setLoader] = useState(false);
    const [userInformations, setUserInformations] = useState({
        email: "",
      });
     
      const handleClick = async (e) => {
        e.preventDefault(); // Prevent default behavior
        const payload = { email: userInformations.email}
        console.log(payload, 'payload body')
        try {
          setLoader(true); 
      
          const response = await axios.post('https://taskmanagement.ranaafaqali.com/api/user/send-invitation', payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
      
          if (response.status === 200) {
            setOpenModal(false);
           
            dispatch(
              openAlert({
                message: 'Invitation send successfully',
                severity: 'success',
              })
            );
           
          } else {
            dispatch(
              openAlert({
                message: 'Invitation send failed',
                severity: 'error',
              })
            );
          }
        } catch (error) {
          console.error('Error adding member:', error);
          dispatch(
            openAlert({
              message: 'Member added failed',
              severity: 'error',
            })
          );
          if (error.response && error.response.data.errMessage === 'Authorization token invalid') {
            dispatch(logout());
            dispatch(openAlert({
              message: 'Authorization token expired. Please log in again.',
              severity: 'error',
            }));
            // Perform additional actions as needed for token expiration
            // ...
          }
        } finally {
          setLoader(false); 
        }
      };







      const handleOpen = () => {
        setOpenModal(true);
      };
      const handleClose = () => {
        setOpenModal(false);
      };

  return (
    <Box>
       <Button
  onClick={handleOpen}
  sx={{
    cursor: "pointer",
    backgroundImage: 'linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204), rgb(197 177 255))',
    color: 'white',
    border: "none",
    fontSize: { xs: 12, sm: 13, md: 14 }, // adjusted for better responsiveness
    boxShadow: "none",
    padding: { xs: "1.6px 11px",  }, // adjusted padding for better small screen fit
    alignItems: "center",
    textTransform: 'none',
    minWidth: "auto" // ensures the button doesn't take too much space on small screens
  }}
>

{!isMobile && <GroupAddOutlined sx={{  fontSize: { xs: 13, sm: 17, md: 17 }, marginRight: "3px" }} /> }
  
  Invite
</Button>


            <Modal
        open={openModal}
        onClose={handleClose}
        style={{ overflow: "auto" ,  top: '25%',

        }}
      >
        <Box>
          <CloseIconWrapper onClick={handleClose}>
            <CloseIcon fontSize="small" color="black" />
          </CloseIconWrapper>
            <MainContainer>
            
            <FormSection>
          <FormCard>
            <Form style={{}}>
              {/* <Title>Log in to Trello</Title> */}
              <h5>Invite specific members for sign-up </h5>
               
               <center> <h5>  with personalized invitations </h5></center> 
              <Input
                type="email"
                placeholder="Enter email"
                required
                value={userInformations.email}
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    email: e.target.value,
                  })
                }
              />
              
              <Click onClick={handleClick}>Send Invitation</Click>
              {loader && <Loader />} 
            </Form>
          </FormCard>
        </FormSection>
    
            </MainContainer>

           
        </Box>
      </Modal>
    </Box>
  )
}

export default SendInvitation;
