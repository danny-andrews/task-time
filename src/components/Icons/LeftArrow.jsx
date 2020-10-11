import * as React from "react";

function SvgLeftArrow(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="left-arrow_svg__feather left-arrow_svg__feather-chevron-left"
      {...props}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default SvgLeftArrow;
