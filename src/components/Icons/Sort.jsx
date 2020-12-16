import * as React from "react";

function SvgSort(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="sort_svg__feather sort_svg__feather-bar-chart"
      {...props}
    >
      <path d="M4 6h16M4 12h10M4 18h4" />
    </svg>
  );
}

export default SvgSort;
