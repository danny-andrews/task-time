import React, { StrictMode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Index from "../../routes/Index";
import { SyncBackend } from "../../shared/backends";
import { PersistenceContext } from "../../shared/contexts";
import CreatePersistence from "../../shared/persistence";

const persistence = CreatePersistence(SyncBackend());

const App = () => (
  <StrictMode>
    <PersistenceContext.Provider value={persistence}>
      <DndProvider backend={HTML5Backend}>
        <Index />
      </DndProvider>
    </PersistenceContext.Provider>
  </StrictMode>
);

export default App;
