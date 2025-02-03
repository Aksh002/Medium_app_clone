//import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

interface PublishProps {
  draft: (id: string | null) => Promise<string>,
  publish: (id: string) => Promise<void>;
}

const Publish = ({draft,publish}:PublishProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const existingId=localStorage.getItem("currentBlogId")?localStorage.getItem("currentBlogId"):null
      const blogId = await draft(existingId);
      await publish(blogId);
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setIsLoading(false);
    }
    
  };
  return (
    <StyledWrapper>
        <button onClick={handleClick}>
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg height={24} width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <span>{isLoading ? 'Publishing...' : 'Publish'}</span>
        </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    font-family: inherit;
    font-size: 16px; /* Reduced font size */
    background: linear-gradient(to bottom, #4dc7d9 0%, #66a6ff 100%);
    color: white;
    padding: 0.4em 0.8em; /* Reduced padding */
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 20px; /* Adjusted border-radius */
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2); /* Reduced shadow */
    transition: all 0.3s;
  }

  button:hover {
    transform: translateY(-2px); /* Adjusted hover effect */
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3); /* Adjusted shadow */
    background: linear-gradient(to bottom, #5bd9ec 0%, #97c3ff 100%);
    cursor: pointer;
  }

  button:active {
    transform: scale(0.95);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  button span {
    display: block;
    margin-left: 0.3em; /* Reduced margin */
    transition: all 0.3s;
  }

  button:hover span {
    scale: 0;
    font-size: 0%;
    opacity: 0;
    transition: all 0.5s;
  }

  button svg {
    width: 15px; /* Reduced svg size */
    height: 13px;
    fill: white;
    transition: all 0.3s;
  }

  button .svg-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px; /* Reduced wrapper size */
    height: 20px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
  }

  button:hover .svg-wrapper {
    background-color: rgba(43, 169, 228, 0.897);
    width: 24px; /* Adjusted hover size */
    height: 24px;
  }

  button:hover svg {
    width: 20px; /* Adjusted svg size on hover */
    height: 20px;
    margin-right: 4px;
    transform: rotate(45deg);
  }
`;

export default Publish;

