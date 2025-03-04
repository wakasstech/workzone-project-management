import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../Background";
import { register } from "../../../Services/userService";
import { useDispatch, useSelector } from "react-redux";
import trelloLogo from "../../../Images/designLogo.png";

import {
  BgContainer,
  Container,
  TrelloIconContainer,
  FormSection,
  FormCard,
  Form,
  Title,
  Input,
  Button,
  Text,
  Icon,
  Hr,
  Link,
} from "./Styled";
import { useEffect } from "react";
// MUI Components
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const Register = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const { pending } = useSelector((state) => state.user);
  const [openTerms, setOpenTerms] = useState(false);

  const [userInformations, setUserInformations] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repassword: "",
  });

  useEffect(() => {
    document.title = "Create a Trello Account"
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(userInformations, dispatch);
  };
  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);

  return (
    <>
      <BgContainer>
        <Background />
      </BgContainer>
      <Container>
        <TrelloIconContainer onClick={() => history.push("/")}>
          {/* <Icon src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg" /> */}
          <Icon src={trelloLogo} />
        </TrelloIconContainer>
        <FormSection>
          <FormCard>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Title>Sign up for your account</Title>
              <Input
                type="text"
                placeholder="Enter full name"
                required
                value={userInformations.name}
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    name: e.target.value,
                  })
                }
              />
              {/* <Input
                type="text"
                placeholder="Enter surname"
                required
                value={userInformations.surname}
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    surname: e.target.value,
                  })
                }
              /> */}
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
              <Input
                type="password"
                placeholder="Enter password"
                required
                value={userInformations.password}
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    password: e.target.value,
                  })
                }
              />
              <Input
                type="password"
                placeholder="Confirm password"
                required
                value={userInformations.repassword}
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    repassword: e.target.value,
                  })
                }
              />
              <Text>
                By signing up, you confirm that you've read and accepted our{" "}
                <Link fontSize="0.75rem" onClick={handleOpenTerms}>Terms of Service </Link> and{" "}
                <Link fontSize="0.75rem" onClick={handleOpenTerms}>Privacy Policy</Link>.
              </Text>
              <Button type="submit" disabled={pending}>
                Complete
              </Button>
              <Hr />
              <Link fontSize="0.85rem" onClick={() => history.push("/login")}>
                Already have an account? Log In
              </Link>
            </Form>
          </FormCard>
        </FormSection>
      </Container>

       {/* Terms of Service Modal */}
       <Modal open={openTerms} onClose={handleCloseTerms}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: '80%', md: '60%', lg: 600 },
            fontSize: { xs: 18, sm: 20, md: 22, lg: 25 },

            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseTerms}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" gutterBottom sx={{fontSize:25, fontWeight:'bold'}}> 
          𝐓𝐞𝐫𝐦𝐬 𝐨𝐟 𝐒𝐞𝐫𝐯𝐢𝐜𝐞 ʕʘ̅͜ʘ̅ʔ
          </Typography>
          <Typography variant="body1">
            Welcome to Work Zone Management! By using our platform, you agree to
            the following terms:
            <ul>
              <li>You must be at least 18 years old to use this service.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>Do not use the platform for illegal activities.</li>
              <li>We reserve the right to terminate accounts that violate these terms.</li>
            </ul>
            <span style={{color: 'orangered', fontWeight:500}}>Thank you for using Work Zone Management!</span>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Register;
