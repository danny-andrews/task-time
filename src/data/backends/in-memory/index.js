import flyd from "flyd";
import * as R from "ramda";

export default () => {
  const store = flyd.stream({});
  let id = 1;

  const getAll = (type) => store.map((val) => R.values(val[type]) || []);

  const get = (type, id) => store.map(R.path([type, id]));

  const create = (type, attrs) => {
    const newId = String(id++);
    const newEntity = { id: newId, ...attrs };
    store(R.assocPath([type, newId], { id: newId, ...attrs }, store()));
    return newEntity;
  };

  const update = (type, id, updater) => {
    const entityLens = R.lensPath([type, id]);
    store(
      R.over(entityLens, (task) => ({ ...task, ...updater(task) }), store())
    );
  };

  const remove = (type, id) => {
    store(R.over(R.lensProp(type), R.omit([id]), store()));
  };

  const transact = (fn) => fn();

  return { getAll, get, create, update, remove, transact };
};
