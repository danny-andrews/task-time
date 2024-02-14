import * as React from "react";

function SvgEdit(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="edit_svg__feather edit_svg__feather-edit-3"
      {...props}
    >
      <path d="M14 2l4 4L7 17H3v-4L14 2zM3 22h18" />
    </svg>
  );
}

export default SvgEdit;
