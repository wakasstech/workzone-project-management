import React from "react";
import styled from "styled-components";
import { sm, xs } from "../BreakPoints";
import SearchIcon from '@mui/icons-material/Search';
import { Search } from "@mui/icons-material";

const Container = styled.div`
  width: 15rem;
  min-width: 6rem;
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: center;
  background-color: #F7F8F9;
  height: 2rem;
  box-sizing: border-box;
  border-radius: 6px;
  border: 2px solid #f0f8ff;
  padding: 0.1rem 0.5rem;
  color: white;
  &:hover {
    background-color: #F7F8F9;
  }
  ${sm({
    width: "10rem",
  })}
  ${xs({
    width: "26.8vw",
  })}
`;
const Input = styled.input`
  box-sizing: content-box;
  font-size: 0.85rem;
  border: none;
  color:#626F86;
  background-color: transparent;
  outline: none;
  height: 1rem;
  overflow: hidden;
  &::placeholder {
    color: #626F86;
  }
  &:focus {
    &::placeholder {
      color: #626F86;;
    }
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  ${xs({
    width: "20px",
    height: "20px",
  })}
`;

const SearchBar = (props) => {
  const {searchString, setSearchString} = props;
  return (
    <Container>
      <Search style={{ fontSize: '18px', color:'#626F86'}} />
      <Input placeholder="Search" value={searchString} onChange={e=>setSearchString(e.target.value)}/>
    </Container>
  );
};

export default SearchBar;
