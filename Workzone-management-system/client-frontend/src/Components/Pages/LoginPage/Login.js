import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../../Services/userService";
import Background from "../../Background";
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
  Icon,
  Hr,
  Link,
} from "./Styled";

const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const [userInformations, setUserInformations] = useState({
    email: "",
    password: "",
    // user_type: "Member", 
  });
  

  useEffect(() => {
    document.title = "Log in to Task Management System";
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    login(userInformations, dispatch);
  };
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
              <Title> 𝐋𝐨𝐠 𝐢𝐧 𝐭𝐨 𝐖𝐨𝐫𝐤 𝐙𝐨𝐧𝐞 ʕʘ̅͜ʘ̅ʔ</Title>
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
              
              <Button>Log in</Button>
              <Hr />
              <Link
                fontSize="0.85rem"
                onClick={() => history.push("/register")}
              >
                Sign up for an account
              </Link>
            </Form>
          </FormCard>
        </FormSection>
      </Container>
    </>
  );
};

export default Login;
