import t from "tap";
import * as R from "ramda";
import { parseISO } from "date-fns";
import Persistence from "../persistence";
import { InMemoryBackend } from "../backends";

const TaskFactory = (attrs = {}) => ({
  text: "Wash the car",
  dueDate: parseISO("2020-09-02"),
  isImportant: false,
  difficulty: "EASY",
  ...attrs,
});

const Subject = (attrs = {}) =>
  Persistence({ backend: InMemoryBackend(), ...attrs });

const createCompletedTask = (subject, { difficulty, dueDate }) => {
  const task = subject.createTask(TaskFactory({ difficulty }));
  subject.updateTask(task.id, {
    dueDate,
    isComplete: true,
  });

  return task;
};

t.test(
  "#tasksByDisplayDate is an observable containing all deserialized tasks, partitioned by dueDate and sorted by position",
  async (is) => {
    const subject = Subject({ now: () => parseISO("2020-09-01") });
    const task1 = subject.createTask(
      TaskFactory({ dueDate: parseISO("2020-09-02") })
    );
    const task2 = subject.createTask(
      TaskFactory({ dueDate: parseISO("2020-09-05") })
    );
    const task3 = subject.createTask(
      TaskFactory({ dueDate: parseISO("2020-09-05") })
    );
    const actual = subject.tasksByDisplayDate();
    is.same(actual, {
      "2020-09-02": [task1],
      "2020-09-05": [task2, task3],
    });
  }
);

t.test("#deleteTask deletes a task", async (is) => {
  const subject = Subject();
  const { id } = subject.createTask(TaskFactory());
  is.same(subject.tasks().length, 1);
  subject.deleteTask(id);
  is.same(subject.tasks().length, 0);
});

t.test(
  "#createTask creates a task, setting originalDueDate, position, and createdAt",
  async (is) => {
    const now = parseISO("2020-09-01");
    const subject = Subject({ now: () => now });
    const { id } = subject.createTask({
      text: "Do the dishes",
      dueDate: parseISO("2020-09-02"),
      isImportant: false,
      difficulty: "MEDIUM",
    });
    is.same(subject.tasks(), [
      {
        id,
        text: "Do the dishes",
        dueDate: parseISO("2020-09-02"),
        originalDueDate: parseISO("2020-09-02"),
        createdAt: now,
        isComplete: false,
        isImportant: false,
        difficulty: "MEDIUM",
        position: 1,
      },
    ]);
  }
);

t.test("#updateTask", async (is) => {
  const subject = Subject();
  const { id } = subject.createTask(TaskFactory({ text: "Do the dishes" }));
  subject.updateTask(id, { text: "Mow the lawn" });
  is.same(subject.getTask(id)().text, "Mow the lawn");
});

t.test("#toggleTask toggles a task's completed state", async (is) => {
  const subject = Subject();
  const { id } = subject.createTask(TaskFactory());
  subject.toggleTask(id);
  const taskStream = subject.getTask(id);
  is.same(taskStream().isComplete, true);
  subject.toggleTask(id);
  is.same(taskStream().isComplete, false);
});

t.test(
  "#refreshTask updates a task's originalDueDate to its current dueDate",
  async (is) => {
    const subject = Subject({ now: () => parseISO("2020-09-01") });
    const { id } = subject.createTask(
      TaskFactory({ dueDate: parseISO("2020-08-04") })
    );
    const taskStream = subject.getTask(id);
    is.same(taskStream().originalDueDate, parseISO("2020-08-04"));
    subject.updateTask(id, { dueDate: parseISO("2020-09-04") });
    subject.refreshTask(id);
    is.same(taskStream().originalDueDate, parseISO("2020-09-04"));
  }
);

t.test("#getTaskDifficulty returns difficulty", async (is) => {
  const subject = Subject();
  is.same(subject.getTaskDifficulty({ difficulty: "EASY" }), 1);
  is.same(subject.getTaskDifficulty({ difficulty: "MEDIUM" }), 2);
  is.same(subject.getTaskDifficulty({ difficulty: "HARD" }), 3);
});

t.test("#getDifficulties returns all difficulties", async (is) => {
  const subject = Subject();
  is.same(subject.getDifficulties(), [
    {
      id: "EASY",
      name: "easy",
      value: 1,
    },
    {
      id: "MEDIUM",
      name: "medium",
      value: 2,
    },
    {
      id: "HARD",
      name: "hard",
      value: 3,
    },
  ]);
});

t.test(
  "#getTotalDifficulty returns total difficulty for a list of tasks",
  async (is) => {
    const subject = Subject();
    is.same(
      subject.getTotalDifficulty([
        { difficulty: "EASY" },
        { difficulty: "MEDIUM" },
        { difficulty: "HARD" },
        { difficulty: "MEDIUM" },
      ]),
      8
    );
  }
);

t.test("#moveTask sets task dueDate and position", async (is) => {
  const subject = Subject({ now: () => parseISO("2020-09-01") });
  const { id } = subject.createTask(
    TaskFactory({ dueDate: parseISO("2020-09-02") })
  );
  subject.createTask(TaskFactory({ dueDate: parseISO("2020-10-05") }));
  subject.moveTask(id, parseISO("2020-10-05"));
  const taskStream = subject.getTask(id);
  is.same(taskStream().dueDate, parseISO("2020-10-05"));
  is.same(taskStream().position, 2);
});

t.test("#changeTaskPosition reorders tasks", async (is) => {
  const dueDate = "2020-09-02";
  const subject = Subject({ now: () => parseISO("2020-09-01") });
  const task1 = subject.createTask(TaskFactory({ dueDate: parseISO(dueDate) }));
  const task2 = subject.createTask(TaskFactory({ dueDate: parseISO(dueDate) }));
  const task3 = subject.createTask(TaskFactory({ dueDate: parseISO(dueDate) }));
  const testStream = subject.tasksByDisplayDate
    .map(R.prop(dueDate))
    .map(R.map(R.prop("id")));

  is.same(testStream(), [task1.id, task2.id, task3.id]);

  subject.changeTaskPosition({
    id: task3.id,
    newDueDate: parseISO(dueDate),
    newIndex: 1,
  });
  is.same(testStream(), [task1.id, task3.id, task2.id], "move up");

  subject.changeTaskPosition({
    id: task1.id,
    newDueDate: parseISO(dueDate),
    newIndex: 1,
  });
  is.same(testStream(), [task3.id, task1.id, task2.id], "move down");

  subject.changeTaskPosition({
    id: task3.id,
    newDueDate: parseISO(dueDate),
    newIndex: 2,
  });
  is.same(
    testStream(),
    [task1.id, task2.id, task3.id],
    "move to last position"
  );

  subject.changeTaskPosition({
    id: task3.id,
    newDueDate: parseISO(dueDate),
    newIndex: 0,
  });
  is.same(
    testStream(),
    [task3.id, task1.id, task2.id],
    "move to first position"
  );

  subject.changeTaskPosition({
    id: task3.id,
    newDueDate: parseISO("2020-09-03"),
    newIndex: 0,
  });
  is.same(testStream(), [task1.id, task2.id], "change due date");
  subject.tasksByDisplayDate.map(R.prop(dueDate)).map(R.map(R.prop("id")));
});

t.test(
  "#recommendedDifficulty returns median of the total difficulty of tasks completed per day in past, rounded down to nearest integer",
  async (is) => {
    const subject = Subject({ now: () => parseISO("2020-09-01") });
    is.same(subject.recommendedDifficulty(), 3, "defaults value to 3");

    createCompletedTask(subject, {
      difficulty: "EASY",
      dueDate: parseISO("2020-08-01"),
    });

    is.same(subject.recommendedDifficulty(), 3, "minimum of 3");

    createCompletedTask(subject, {
      difficulty: "MEDIUM",
      dueDate: parseISO("2020-08-01"),
    });
    createCompletedTask(subject, {
      difficulty: "HARD",
      dueDate: parseISO("2020-08-02"),
    });
    createCompletedTask(subject, {
      difficulty: "HARD",
      dueDate: parseISO("2020-08-02"),
    });

    is.same(
      subject.recommendedDifficulty(),
      4,
      "even number of days, floors median"
    );

    createCompletedTask(subject, {
      difficulty: "HARD",
      dueDate: parseISO("2020-08-03"),
    });

    is.same(subject.recommendedDifficulty(), 3, "odd number of days");
  }
);

t.test(
  "#sortTasks stably sorts tasks by completion status, importance, difficulty, and staleness",
  async (is) => {
    const dueDate = "2020-10-05";
    const subject = Subject({ now: () => parseISO("2020-09-01") });
    const { id: id1 } = subject.createTask(
      TaskFactory({
        dueDate: parseISO(dueDate),
        isImportant: false,
        difficulty: "EASY",
      })
    );

    const { id: id2 } = subject.createTask(
      TaskFactory({
        dueDate: parseISO(dueDate),
        isImportant: true,
        difficulty: "EASY",
      })
    );

    const { id: id3, position } = subject.createTask(
      TaskFactory({
        dueDate: parseISO(dueDate),
        isImportant: false,
        difficulty: "HARD",
      })
    );

    const { id: id4 } = subject.createTask(
      TaskFactory({
        dueDate: parseISO(dueDate),
        isImportant: true,
        difficulty: "HARD",
      })
    );
    subject.toggleTask(id4);

    const { id: id5 } = subject.createTask(
      TaskFactory({
        dueDate: parseISO(dueDate),
        isImportant: false,
        difficulty: "EASY",
      })
    );
    // i.e. Give it a staleness value
    subject.updateTask(id5, { originalDueDate: parseISO("2020-10-03") });

    const { id: id6 } = subject.createTask(
      TaskFactory({
        dueDate: parseISO(dueDate),
        isImportant: false,
        difficulty: "EASY",
      })
    );
    // Make it come before id4
    subject.updateTask(id6, { position: position - 1 });

    subject.sortTasksInDay(parseISO(dueDate));

    is.same(subject.tasksByDisplayDate()[dueDate].map(R.prop("id")), [
      id2,
      id3,
      id5,
      id1,
      id6,
      id4,
    ]);
  }
);

t.test("#reallocateTasks", async (is) => {
  const subject = Subject({ now: () => parseISO("2020-09-01") });

  createCompletedTask(subject, {
    difficulty: "HARD",
    dueDate: parseISO("2020-08-01"),
  });
  is.same(subject.recommendedDifficulty(), 3);

  const { id: id2 } = createCompletedTask(subject, {
    difficulty: "EASY",
    dueDate: parseISO("2020-09-01"),
  });
  const { id: id3 } = subject.createTask(
    TaskFactory({
      dueDate: parseISO("2020-09-01"),
      difficulty: "MEDIUM",
    })
  );
  const { id: id4 } = subject.createTask(
    TaskFactory({
      dueDate: parseISO("2020-09-01"),
      difficulty: "MEDIUM",
    })
  );
  const { id: id5 } = subject.createTask(
    TaskFactory({
      dueDate: parseISO("2020-09-01"),
      difficulty: "EASY",
    })
  );
  const { id: id6 } = subject.createTask(
    TaskFactory({
      dueDate: parseISO("2020-09-02"),
      difficulty: "EASY",
    })
  );

  subject.partitionTasks(parseISO("2020-09-01"));

  is.same(subject.tasksByDisplayDate()["2020-09-01"].map(R.prop("id")), [
    id2,
    id3,
  ]);
  is.same(subject.tasksByDisplayDate()["2020-09-02"].map(R.prop("id")), [
    id6,
    id4,
  ]);
  is.same(subject.tasksByDisplayDate()["2020-09-03"].map(R.prop("id")), [id5]);
});
