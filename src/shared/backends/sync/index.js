/* global process */
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { v4 as uuidv4 } from "uuid";
import flyd from "flyd";
import { setMany, createMap } from "./util";

const TEST_USER_ID = "test-user-3";

export default () => {
  const doc = new Y.Doc();
  const websocketProvider = new WebsocketProvider(
    process.env.SYNC_WEBSOCKET_URL,
    TEST_USER_ID,
    doc,
    { connect: false }
  );
  websocketProvider.connect();

  const indexeddbProvider = new IndexeddbPersistence("task-time", doc);
  indexeddbProvider.whenSynced.then(() => {
    console.log("loaded data from indexed db");
  });

  const getYEntity = (type, id) =>
    doc
      .getArray(type)
      .toArray()
      .find((entity) => entity.get("id") === id);

  const getEntity = (type, id) => {
    const yEntity = getYEntity(type, id);
    const property = flyd.stream(yEntity.toJSON());
    yEntity.observe(() => {
      property(yEntity.toJSON());
    });

    return property;
  };

  const getEntities = (type) => {
    const yEntities = doc.getArray(type);
    const property = flyd.stream(yEntities.toJSON());
    yEntities.observeDeep(() => {
      property(yEntities.toJSON());
    });

    return property;
  };

  const createEntity = (type, attrs) => {
    const id = uuidv4();
    const entity = {
      ...attrs,
      id,
    };
    const yEntity = createMap(entity);

    doc.getArray(type).push([yEntity]);

    return yEntity.toJSON();
  };

  const updateEntity = (type, id, updates) => {
    const existingEntity = getYEntity(type, id);

    setMany(updates, existingEntity);

    return getYEntity(type, id).toJSON();
  };

  const deleteEntity = (type, id) => {
    const yArray = doc.getArray(type);
    const index = yArray
      .toArray()
      .findIndex((entity) => entity.get("id") === id);

    yArray.delete(index);
  };

  return {
    getEntity,
    getEntities,
    createEntity,
    updateEntity,
    deleteEntity,
  };
};
