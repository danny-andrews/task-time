import React, { StrictMode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Index from "../../routes/Index";
import { SyncBackend } from "../../data/backends";
import UserConfig from "../../data/user-config";
import { PersistenceContext, UserConfigContext } from "../../shared";
import CreatePersistence from "../../data/persistence";

const App = () => (
  <StrictMode>
    <PersistenceContext.Provider
      value={CreatePersistence({ backend: SyncBackend() })}
    >
      <UserConfigContext.Provider value={UserConfig()}>
        <DndProvider backend={HTML5Backend}>
          <Index />
        </DndProvider>
      </UserConfigContext.Provider>
    </PersistenceContext.Provider>
  </StrictMode>
);

export default App;
