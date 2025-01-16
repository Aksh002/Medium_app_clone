import React from 'react';
import styled from 'styled-components';

const Like = () => {
  return (
    <StyledWrapper>
      <div className="like-button">
        <input className="on" id="heart" type="checkbox" />
        <label className="like" htmlFor="heart">
          <svg className="like-icon" fillRule="nonzero" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
          <span className="like-text">Likes</span>
        </label>
        <span className="like-count one">68</span>
        <span className="like-count two">69</span>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  #heart {
    display: none;
  }

  .like-button {
    position: relative;
    cursor: pointer;
    display: flex;
    height: 28px; /* Further reduced height */
    width: 80px; /* Further reduced width */
    border-radius: 8px; /* Adjusted for smaller size */
    border: none;
    background-color: #1d1d1d;
    overflow: hidden;
    box-shadow: 
      inset -1px -1px 3px rgba(255, 255, 255, 0.2),
      inset 1px 1px 3px rgba(0, 0, 0, 0.1),
      2px 2px 6px rgba(0, 0, 0, 0.4),
      -1px -1px 4px rgba(255, 255, 255, 0.1);
  }

  .like {
    width: 70%;
    height: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: space-evenly;
  }

  .like-icon {
    fill: #505050;
    height: 16px; /* Further reduced size */
    width: 16px; /* Further reduced size */
  }

  .like-text {
    color: #fcfcfc;
    font-size: 11px; /* Further reduced font size */
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .like-count {
    position: absolute;
    right: 0;
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #717070;
    font-size: 11px; /* Further reduced font size */
    border-left: 1px solid #4e4e4e;
    transition: all 0.5s ease-out;
  }

  .like-count.two {
    transform: translateY(20px); /* Adjusted for smaller size */
  }

  .on:checked ~ .like .like-icon {
    fill: #fc4e4e;
    animation: enlarge 0.2s ease-out 1;
    transition: all 0.2s ease-out;
  }

  .on:checked ~ .like-count.two {
    transform: translateX(0);
    color: #fcfcfc;
  }

  .on:checked ~ .like-count.one {
    transform: translateY(-20px); /* Adjusted for smaller size */
  }

  @keyframes enlarge {
    0% {
      transform: scale(0.4);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default Like;
