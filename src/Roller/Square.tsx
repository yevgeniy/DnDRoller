import * as React from "react";

const Square = (props: { className?: string }) => {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 600 600"
      xmlSpace="preserve"
    >
      <polygon
        points="0,0 600,0 600,600 0,600 0,0"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  );
};

export default Square;
