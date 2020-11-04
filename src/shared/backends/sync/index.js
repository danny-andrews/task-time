/* global process */
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { v4 as uuidv4 } from "uuid";
import Kefir from "kefir";

const TEST_USER_ID = "test-user-1234";

export default () => {
  const doc = new Y.Doc();
  new WebsocketProvider(process.env.SYNC_WEBSOCKET_URL, TEST_USER_ID, doc);

  const getEntity = (type, id) => doc.getMap(type).get(id);

  const getEntities = (type) => {
    const yEntities = doc.getMap(type);
    return Kefir.stream((emitter) => {
      yEntities.observe(() => {
        emitter.emit(Array.from(yEntities.values()));
      });
      emitter.emit(Array.from(yEntities.values()));
    });
  };

  const createEntity = (type, attrs) => {
    const id = uuidv4();
    const entity = {
      ...attrs,
      id,
    };

    doc.getMap(type).set(id, entity);

    return entity;
  };

  const updateEntity = (type, id, updates) => {
    const existingEntity = doc.getMap(type).get(id);
    const updatedEntity = { ...existingEntity, ...updates };
    doc.getMap(type).set(id, updatedEntity);
    return updatedEntity;
  };

  const deleteEntity = (type, id) => {
    doc.getMap(type).delete(id);
  };

  return {
    getEntity,
    getEntities,
    createEntity,
    updateEntity,
    deleteEntity,
  };
};
