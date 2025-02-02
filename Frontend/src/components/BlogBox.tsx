import React from 'react';
import styled from 'styled-components';

const BlogBox1 = ({fxn,props}) => {
  return (
    <StyledWrapper>
      <div className="group">
        <input required type="text" className="input text-black" />
        <span className="highlight" />
        <span className="bar" />
        <label>{props}</label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .group {
    position: relative;
  }

  .input {
    font-size:clamp(16px, 10vw, 40px); /* Ensures the font size is responsive but not too small or large */
    padding: 10px 5px; /* Adjust padding to make the box comfortable on all devices */
    display: block;
    width: 100%; /* Full width of the container */
    max-width: 1600px; /* Sets a maximum width for larger screens */
    border: none;
    border-bottom: 1px solid #a9aeae;
    margin-bottom: 1px;
    background: transparent;
    font-family: 'Roboto', serif;
  }

  .input:focus {
    outline: none;
    border-color: #494a4b
  }

  label {
    color: #a9aeae;
    font-size: clamp(16px, 6vw, 40px); /* Responsive font size for the label */
    font-weight: thin;
    font-family: 'Roboto', serif;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 20px; /* Reduced gap between placeholder and bottom bar */
    transition: 0.2s ease all;
  }

  .input:focus ~ label, .input:valid ~ label {
    top: -9px; /* Adjusted position when focused */
    font-size: 0.9rem; /* Smaller size for focused state */
    font-weight: extrathin;
    color:#494a4b;
  }

  .bar {
    position: relative;
    display: block;
    width: 100%; /* Bar stretches with input width */
    max-width: 1600px;
  }

  .highlight {
    position: absolute;
    height: 100%; /* Reduced height for highlight effect */
    width: 100px;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
  }

  .input:focus ~ .highlight {
    animation: inputHighlighter 0.3s ease;
  }

  @keyframes inputHighlighter {
    from {
      background: #f9ebce;
    }
    to {
      width: 0;
      background: transparent;
    }
  }

  /* Media Query for Smaller Screens */
  @media (max-width: 768px) {
    .input {
      font-size: clamp(14px, 4vw, 32px); /* Slightly smaller font for smaller screens */
      padding: 8px 5px; /* Adjust padding for mobile */
    }

    label {
      font-size: clamp(12px, 4vw, 24px); /* Ensure label text is still readable */
      top: 6px; /* Reduce gap for smaller screens */
    }
  }
`;



  const BlogBox2 = ({fxn,props}) => {
    return (
      <StyledWrapper2>
        <div className="group">
          <input onChange={(e)=>fxn(e.target.value)} required type="text" className="input text-black" />
          <span className="highlight" />
          <span className="bar" />
          <label>{props}</label>
        </div>
      </StyledWrapper2>
    );
  }
  
  const StyledWrapper2 = styled.div`
  .group {
    position: relative;
  }

  .input {
    font-size: 1.2rem; /* Base font size */
    padding: 0.75rem 0.5rem; /* Responsive padding */
    display: block;
    width: 100%; /* Full width */
    max-width: 1600px; /* Max width for large screens */
    min-width: 500px; /* Minimum width for smaller screens */
    border: none;
    border-bottom: 1px solid #a9aeae;
    margin-bottom: 2px;
    background: transparent;
    color:#757574 ;
  }

  .input:focus {
    outline: none;
    border-color: #494a4b
  }

  label {
    color: #a9aeae;
    font-size: 1rem;
    font-weight: thin;
    position: absolute;
    pointer-events: none;
    left: 0.5rem;
    top: 0.75rem;
    transition: 0.2s ease all;
  }

  .input:focus ~ label, .input:valid ~ label {
    top: -1rem;
    font-size: 0.8rem;
    color: #494a4b;
    
  }

  .bar {
    position: relative;
    display: block;
    width: 100%;
    max-width: 1600px;
  }

  .highlight {
    position: absolute;
    height: 60%;
    width: 100px;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
  }

  /* Responsive Styling for Smaller Screens */
  @media (max-width: 768px) {
    .input {
      font-size: 1rem; /* Adjust font size for tablets */
      padding: 0.5rem 0.5rem;
    }

    label {
      font-size: 0.9rem; /* Adjust label size for smaller screens */
    }
  }

  @media (max-width: 480px) {
    .input {
      font-size: 0.9rem; /* Smaller font size for very small screens */
      padding: 0.4rem 0.5rem;
      min-width: 200px; /* Ensure minimum input box width */
    }

    label {
      font-size: 0.8rem; /* Label adapts as well */
    }
  }
`;

const BlogBox3 = ({fxn}) => {
  return (
    <StyledWrapper3>
      <textarea
        className="responsive-input"
        placeholder="Tell your story..."
        onChange={(e)=>fxn(e.target.value)}
      ></textarea>
    </StyledWrapper3>
  );
};

const StyledWrapper3 = styled.div`
  .responsive-input {
    width: 100%; /* Default width for larger screens */
    min-width: 500px; /* Prevent getting too small on small screens */
    max-width: 1600px; /* Maximum width for large screens */
    height: 400px; /* Fixed height */
    padding: 0px; /* Inner spacing */
    font-size: 1rem; /* Base font size */
    color: black; /* Input text color */
    background: transparent; /* Transparent background */
    border: none; /* Remove default border */
    border-top: 1px solid #a9aeae; /* Top border */
    border-bottom: 1px solid #a9aeae; /* Bottom border */
    box-sizing: border-box; /* Include padding in width/height */
  }

  .responsive-input:focus {
    border-color: #494a4b; /* Highlight top-bottom border on focus */
    outline: none; /* Remove default outline */
    box-shadow: none; /* No shadow effect */
  }

  /* Responsive styles for smaller screens */
  @media (max-width: 640px) {
    .responsive-input {
      width: 95%; /* Use more screen width for small devices */
      min-width: 250px; /* Prevent the input from shrinking too much */
      font-size: 0.9rem; /* Slightly smaller font size */
    }
  }
`;


export {BlogBox1,BlogBox2,BlogBox3};
