import React from 'react';
import styled from 'styled-components';
interface draftType{
  draft: (existingId:string | null) => Promise<string>
}
const SaveDraft = ({draft}:draftType) => {
  return (
    <StyledWrapper>
      <button onClick={()=>draft(localStorage.getItem("currentBlogId")?localStorage.getItem("currentBlogId"):null)} className="cssbuttons-io">
        <span>Save Draft</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cssbuttons-io {
    position: relative;
    font-family: inherit;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.05em;
    border-radius: 0.8em;
    cursor: pointer;
    border: none;
    background: linear-gradient(to right, #8e2de2, #4a00e0);
    color: ghostwhite;
    overflow: hidden;
  }

  .cssbuttons-io svg {
    width: 1.2em;
    height: 0.8em;
    margin-right: 0.5em;
  }

  .cssbuttons-io span {
    position: relative;
    z-index: 10;
    transition: color 0.4s;
    display: inline-flex;
    align-items: center;
    padding: 0.8em 1.2em 0.8em 1.05em;
  }

  .cssbuttons-io::before,
  .cssbuttons-io::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .cssbuttons-io::before {
    content: "";
    background: #000;
    width: 120%;
    left: -10%;
    transform: skew(30deg);
    transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
  }

  .cssbuttons-io:hover::before {
    transform: translate3d(100%, 0, 0);
  }

  .cssbuttons-io:active {
    transform: scale(0.95);
  }`;

export default SaveDraft;
