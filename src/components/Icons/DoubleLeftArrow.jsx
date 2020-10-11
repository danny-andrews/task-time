import * as React from "react";

function SvgDoubleLeftArrow(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="double-left-arrow_svg__feather double-left-arrow_svg__feather-chevrons-left"
      {...props}
    >
      <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
    </svg>
  );
}

export default SvgDoubleLeftArrow;
