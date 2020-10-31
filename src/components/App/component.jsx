import React, { StrictMode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Index from "../../routes/Index";
import { SyncBackend } from "../../shared/backends";
import { BackendContext } from "../../shared/contexts";

const backend = SyncBackend();

const App = () => (
  <StrictMode>
    <BackendContext.Provider value={backend}>
      <DndProvider backend={HTML5Backend}>
        <Index />
      </DndProvider>
    </BackendContext.Provider>
  </StrictMode>
);

export default App;
