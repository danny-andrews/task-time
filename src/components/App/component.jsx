import React, { StrictMode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Main from "../../routes/Main";
import { LocalStorageBackend } from "../../shared/backends";
import { BackendContext } from "../../shared/contexts";

const backend = LocalStorageBackend();

const App = () => (
  <StrictMode>
    <BackendContext.Provider value={backend}>
      <DndProvider backend={HTML5Backend}>
        <Main />
      </DndProvider>
    </BackendContext.Provider>
  </StrictMode>
);

export default App;
