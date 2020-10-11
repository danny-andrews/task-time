import * as React from "react";

function SvgDoubleRightArrow(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="double-right-arrow_svg__feather double-right-arrow_svg__feather-chevrons-right"
      {...props}
    >
      <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
    </svg>
  );
}

export default SvgDoubleRightArrow;
