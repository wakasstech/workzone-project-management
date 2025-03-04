import React, { useEffect } from "react";
import IndexNav from "../../IndexNav";
import { useHistory } from "react-router-dom";
import {
  Container,
  Content,
  LeftSide,
  RightSide,
  LeftWrapper,
  Title,
  Text,
  Button,
  SvgItem,
} from "./Styled";

const Index = () => {
  let history = useHistory();
  useEffect(() => {
    document.title = "Task Management"
  }, [])
  return (
    <>
      <IndexNav />
      <Container>
        <Content>
          <LeftSide>
            <LeftWrapper>
              <Title>WorkZone helps teams move work forward.</Title>
              <Text>
                Transform your workspace with WorkZone. Simplify project management and amplify team success.
              </Text>
              <Button onClick={() => history.push("/register")}>
                Sign up - it's free
              </Button>
            </LeftWrapper>
          </LeftSide>
          <RightSide>
            {/* <SvgItem src="https://images.ctfassets.net/rz1oowkt5gyp/5QIzYxue6b7raOnVFtMyQs/113acb8633ee8f0c9cb305d3a228823c/hero.png?w=1200&fm=webp" /> */}
            <SvgItem src="https://freepngimg.com/download/teamwork/13-2-team-work-transparent.png"/>

          </RightSide>
        </Content>
      </Container>
    </>
  );
};

export default Index;
