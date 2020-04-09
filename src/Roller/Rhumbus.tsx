import * as React from "react";

const Rhombus = (props: { className?: string }) => {
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
        points="300,0 600,300 300,600 0,300 300,0"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  );
};

export default Rhombus;
