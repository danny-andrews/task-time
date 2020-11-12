/* global process */
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { v4 as uuidv4 } from "uuid";
import Kefir from "kefir";
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

  const getYEntity = (type, id) =>
    doc
      .getArray(type)
      .toArray()
      .find((entity) => entity.get("id") === id);

  const getEntity = (type, id) => {
    const yEntity = getYEntity(type, id);

    return Kefir.stream((emitter) => {
      yEntity.observe(() => {
        emitter.emit(yEntity.toJSON());
      });
    }).toProperty(() => yEntity.toJSON());
  };

  const getEntities = (type) => {
    const yEntities = doc.getArray(type);
    return Kefir.stream((emitter) => {
      yEntities.observeDeep(() => {
        emitter.emit(yEntities.toJSON());
      });
    }).toProperty(() => yEntities.toJSON());
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
