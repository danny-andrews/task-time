import { v4 as uuidv4 } from "uuid";
import { assoc, merge, omit } from "ramda";
import ls from "local-storage";
import { serializeDate } from "../../dates";
import { normalizeModels as serialize } from "../../model";

const updateItem = (key, updater) => {
  const item = ls.get(key);
  ls.set(key, updater(item));
};

export default () => {
  const create = (entityName, attributes) => {
    const id = uuidv4();
    const resource = {
      id,
      createdAt: serializeDate(Date.now()),
      ...attributes,
    };
    updateItem(entityName, assoc(id, resource));

    return Promise.resolve(resource);
  };

  const retrieveAll = (entityName) =>
    Promise.resolve(ls.get(entityName)).then(Object.values);

  const retrieve = (entityName, id) => Promise.resolve(ls.get(entityName)[id]);

  const update = (entityName, id, updates) =>
    retrieve(entityName, id).then((entity) => {
      const newEntity = merge(entity, updates);
      updateItem(entityName, assoc(id, newEntity));

      return newEntity;
    });

  const remove = (entityName, id) => {
    updateItem(entityName, omit([id]));

    return Promise.resolve();
  };

  const seed = (entityName, seedData) => {
    ls.set(entityName, serialize(seedData));
  };

  return { create, retrieveAll, update, remove, seed };
};
