import React from "react";
import styled from "styled-components";
import { assets } from "../assests/assests";
function welcome({ currentUser }) {
  return (
    <Container>
      <img src={assets.Bot} alt="Robot" />
      <h1>
        Welcome,<span>{currentUser.username}</span>
      </h1>
      <h3>Please select a chat to Start Message</h3>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  img {
    height: 40vh;
    width: 40vw;
  }
  span {
    color: #4e0eff;
  }
`;

export default welcome;
