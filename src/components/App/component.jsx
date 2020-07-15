import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DayGrid from "../DayGrid";
import Header from "../Header";
import { LocalStorageBackend } from "../../shared/backends";
import { BackendContext } from "../../shared/contexts";
import { Section } from "../Atoms";

const backend = LocalStorageBackend();

const App = () => (
  <BackendContext.Provider value={backend}>
    <DndProvider backend={HTML5Backend}>
      <Section>
        <Header />
        <Section>
          <DayGrid />
        </Section>
      </Section>
    </DndProvider>
  </BackendContext.Provider>
);

export default App;
