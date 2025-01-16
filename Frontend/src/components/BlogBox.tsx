import React from 'react';
import styled from 'styled-components';

const BlogBox1 = ({props}) => {
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
   font-size: 36px;
   padding: 10px 10px 10px 5px;
   display: block;
   width: 750px;
   border: none;
   border-bottom: 1px solid #a9aeae;
   margin-bottom: 2px;
   background: transparent;
  }

  .input:focus {
   outline: none;
  }

  label {
   color: #a9aeae;
   font-size: 36px;
   font-weight: thin;
   position: absolute;
   pointer-events: none;
   left: 5px;
   top: 10px;
   transition: 0.2s ease all;
   -moz-transition: 0.2s ease all;
   -webkit-transition: 0.2s ease all;
  }

  .input:focus ~ label, .input:valid ~ label {
   top: -20px;
   font-size: 0px;
   color: #494a4b;
  }

  .bar {
   position: relative;
   display: block;
   width: 750px;
  }

  .bar:before, .bar:after {
   content: '';
   height: 2px;
   width: 0;
   bottom: 1px;
   position: absolute;
   background: #a9aeae;
   transition: 0.2s ease all;
   -moz-transition: 0.2s ease all;
   -webkit-transition: 0.2s ease all;
  }

  .bar:before {
   left: 50%;
  }

  .bar:after {
   right: 50%;
  }

  .input:focus ~ .bar:before, .input:focus ~ .bar:after {
   width: 50%;
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
  }`;

  const BlogBox2 = ({props}) => {
    return (
      <StyledWrapper2>
        <div className="group">
          <input required type="text" className="input text-black" />
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
     font-size: 20px;
     padding: 10px 10px 10px 5px;
     display: block;
     width: 750px;
     hieght: 2px;
     border: none;
     border-bottom: 1px solid #a9aeae;
     margin-bottom: 2px;
     background: transparent;
    }
  
    .input:focus {
     outline: none;
    }
  
    label {
     color: #a9aeae;
     font-size: 20px;
     font-weight: thin;
     position: absolute;
     pointer-events: none;
     left: 5px;
     top: 10px;
     transition: 0.2s ease all;
     -moz-transition: 0.2s ease all;
     -webkit-transition: 0.2s ease all;
    }
  
    .input:focus ~ label, .input:valid ~ label {
     top: -20px;
     font-size: 0px;
     color: #494a4b;
    }
  
    .bar {
     position: relative;
     display: block;
     width: 750px;
    }
  
    .bar:before, .bar:after {
     content: '';
     height: 2px;
     width: 0;
     bottom: 1px;
     position: absolute;
     background: #a9aeae;
     transition: 0.2s ease all;
     -moz-transition: 0.2s ease all;
     -webkit-transition: 0.2s ease all;
    }
  
    .bar:before {
     left: 50%;
    }
  
    .bar:after {
     right: 50%;
    }
  
    .input:focus ~ .bar:before, .input:focus ~ .bar:after {
     width: 50%;
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
    }`;

export {BlogBox1,BlogBox2};
