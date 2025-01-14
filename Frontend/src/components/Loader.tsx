import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <button className='typewritter-button'>
        <div className="typewriter">
          <div className="slide"><i /></div>
          <div className="paper" />
          <div className="keyboard" />
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .typewriter {
  --blue: #646970;
  --blue-dark: #1d2327;
  --key: #fff;
  --paper: #eef0fd;
  --text: #00000049;
  --tool: #ffbb00;
  --duration: 3s;
  position: relative;
  -webkit-animation: bounce05 var(--duration) linear infinite;
  animation: bounce05 var(--duration) linear infinite;
}

.typewriter .slide {
  width: 46px; /* Reduced width */
  height: 10px; /* Reduced height */
  border-radius: 3px;
  margin-left: 7px;
  transform: translateX(7px);
  background: linear-gradient(var(--blue), var(--blue-dark));
  -webkit-animation: slide05 var(--duration) ease infinite;
  animation: slide05 var(--duration) ease infinite;
}

.typewriter .slide:before,
.typewriter .slide:after,
.typewriter .slide i:before {
  content: "";
  position: absolute;
  background: var(--tool);
}

.typewriter .slide:before {
  width: 1px; /* Reduced size */
  height: 4px;
  top: 3px;
  left: 100%;
}

.typewriter .slide:after {
  left: 47px;
  top: 1.5px;
  height: 7px;
  width: 3px;
  border-radius: 1.5px;
}

.typewriter .slide i {
  display: block;
  position: absolute;
  right: 100%;
  width: 3px; /* Reduced size */
  height: 2px;
  top: 2px;
  background: var(--tool);
}

.typewriter .slide i:before {
  right: 100%;
  top: -1px;
  width: 2px;
  border-radius: 1px;
  height: 7px;
}

.typewriter .paper {
  position: absolute;
  left: 12px;
  top: -13px;
  width: 20px; /* Reduced width */
  height: 23px; /* Reduced height */
  border-radius: 2.5px;
  background: var(--paper);
  transform: translateY(23px);
  -webkit-animation: paper05 var(--duration) linear infinite;
  animation: paper05 var(--duration) linear infinite;
}

.typewriter .paper:before {
  content: "";
  position: absolute;
  left: 3px;
  right: 3px;
  top: 3.5px;
  border-radius: 1px;
  height: 2px;
  transform: scaleY(0.8);
  background: var(--text);
  box-shadow: 0 6px 0 var(--text), 0 12px 0 var(--text), 0 18px 0 var(--text);
}

.typewriter .keyboard {
  width: 60px; /* Reduced width */
  height: 28px; /* Reduced height */
  margin-top: -5px;
  z-index: 1;
  position: relative;
}

.typewriter .keyboard:before,
.typewriter .keyboard:after {
  content: "";
  position: absolute;
}

.typewriter .keyboard:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 3.5px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  transform: perspective(5px) rotateX(2deg);
  transform-origin: 50% 100%;
}

.typewriter .keyboard:after {
  left: 1px;
  top: 12.5px;
  width: 5.5px;
  height: 2px;
  border-radius: 1px;
  box-shadow: 7.5px 0 0 var(--key), 15px 0 0 var(--key), 22.5px 0 0 var(--key),
    30px 0 0 var(--key), 37.5px 0 0 var(--key), 45px 0 0 var(--key),
    11px 5px 0 var(--key), 18.5px 5px 0 var(--key), 26px 5px 0 var(--key),
    30px 5px 0 var(--key), 34px 5px 0 var(--key), 41.5px 5px 0 var(--key);
  -webkit-animation: keyboard05 var(--duration) linear infinite;
  animation: keyboard05 var(--duration) linear infinite;
}

@keyframes bounce05 {
  85%,
  92%,
  100% {
    transform: translateY(0);
  }

  89% {
    transform: translateY(-2px);
  }

  95% {
    transform: translateY(1px);
  }
}

@keyframes slide05 {
  5% {
    transform: translateX(7px);
  }

  15%,
  30% {
    transform: translateX(3px);
  }

  40%,
  55% {
    transform: translateX(0);
  }

  65%,
  70% {
    transform: translateX(-2px);
  }

  80%,
  89% {
    transform: translateX(-6px);
  }

  100% {
    transform: translateX(7px);
  }
}

@keyframes paper05 {
  5% {
    transform: translateY(23px);
  }

  20%,
  30% {
    transform: translateY(17px);
  }

  40%,
  55% {
    transform: translateY(11px);
  }

  65%,
  70% {
    transform: translateY(5px);
  }

  80%,
  85% {
    transform: translateY(0);
  }

  92%,
  100% {
    transform: translateY(23px);
  }
}

@keyframes keyboard05 {
  /* Adjusted animations to scale */
}
`;

export default Loader;
