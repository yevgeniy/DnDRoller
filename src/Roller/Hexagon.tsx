import * as React from "react";

interface IHexagon {
  className?: string;
}

const Hexagon = (props: IHexagon) => {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 723 543"
      xmlSpace="preserve"
    >
      <polygon
        points="723,314 543,625.769145 183,625.769145 3,314 183,2.230855 543,2.230855 723,314"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  );
};

export default Hexagon;
