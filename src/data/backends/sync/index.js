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

  new IndexeddbPersistence("task-time", doc);

  const getYEntity = (type, id) =>
    doc
      .getArray(type)
      .toArray()
      .find((entity) => entity.get("id") === id);

  const get = (type, id) => {
    const yEntity = getYEntity(type, id);
    const property = flyd.stream(yEntity.toJSON());
    yEntity.observe(() => {
      property(yEntity.toJSON());
    });

    return property;
  };

  const getAll = (type) => {
    const yEntities = doc.getArray(type);
    const property = flyd.stream(yEntities.toJSON());
    yEntities.observeDeep(() => {
      property(yEntities.toJSON());
    });

    return property;
  };

  const create = (type, attrs) => {
    const id = uuidv4();
    const entity = {
      ...attrs,
      id,
    };
    const yEntity = createMap(entity);

    doc.getArray(type).push([yEntity]);

    return yEntity.toJSON();
  };

  const update = (type, id, updater) => {
    const existingEntity = getYEntity(type, id);

    setMany(updater(existingEntity.toJSON()), existingEntity);

    return getYEntity(type, id).toJSON();
  };

  const remove = (type, id) => {
    const yArray = doc.getArray(type);
    const index = yArray
      .toArray()
      .findIndex((entity) => entity.get("id") === id);

    yArray.delete(index);
  };

  return { get, getAll, create, update, remove };
};
