import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

const Submit = ({onClick}) => {
  //const setLogin=useSetRecoilState(loginAtom)
  return (
    <StyledWrapper>
      <button onClick={()=>onClick()} className="button">
        SUBMIT →
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    --font-color: #fefefe;
    --bg-color: #111;
    --main-color: #fefefe;
    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }

  .button:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
  }`;

export default Submit;
