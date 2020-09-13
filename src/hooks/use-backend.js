import { useContext } from "react";
import { useQuery, queryCache } from "react-query";
import { QUERY_IDS } from "../shared/constants";
import { BackendContext } from "../shared/contexts";

export default () => {
  const backend = useContext(BackendContext);

  return {
    useDifficulties: () =>
      useQuery(QUERY_IDS.DIFFICULTIES, backend.getDifficulties, {
        cacheTime: Infinity,
      }),
    useTasks: () => useQuery(QUERY_IDS.TASKS, backend.getTasks),
    updateTask: (...args) =>
      backend.updateTask(...args).then(() => {
        queryCache.invalidateQueries(QUERY_IDS.TASKS);
      }),
    deleteTask: (...args) =>
      backend.deleteTask(...args).then(() => {
        queryCache.invalidateQueries(QUERY_IDS.TASKS);
      }),
    createTask: (...args) =>
      backend.createTask(...args).then(() => {
        queryCache.invalidateQueries(QUERY_IDS.TASKS);
      }),
  };
};
