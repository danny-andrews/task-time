import { createElement } from "react";
import { render as reactRender } from "react-dom";

export const render = (Component, id) => {
  reactRender(createElement(Component), document.getElementById(id));
};
