import t from "tap";
import R from "ramda";
import { parseISO } from "date-fns";
import Persistence from "../persistence";
import { InMemoryBackend } from "../backends";

const TaskFactory = (attrs = {}) => ({
  text: "Wash the car",
  dueDate: parseISO("2020-09-02"),
  isImportant: false,
  difficulty: "EASY",
  index: 0,
  ...attrs,
});

const Subject = (attrs = {}) =>
  Persistence({ backend: InMemoryBackend(), ...attrs });

t.test(
  "#tasksByDisplayDate is an observable containing all deserialized tasks, partitioned by dueDate and sorted by position",
  async (is) => {
    const subject = Subject({ now: () => parseISO("2020-09-01") });
    const task1 = subject.createTask(
      TaskFactory({
        dueDate: parseISO("2020-09-02"),
        index: 0,
      })
    );
    const task2 = subject.createTask(
      TaskFactory({
        dueDate: parseISO("2020-09-05"),
        index: 1,
      })
    );
    const task3 = subject.createTask(
      TaskFactory({
        dueDate: parseISO("2020-09-05"),
        index: 0,
      })
    );
    const actual = subject.tasksByDisplayDate();
    is.same(actual, {
      "2020-09-02": [task1],
      "2020-09-05": [task3, task2],
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
      index: 0,
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

t.test("#updateTask updates a task", async (is) => {
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

t.test("#getDifficulty returns difficulty", async (is) => {
  const subject = Subject();
  is.same(subject.getDifficulty("EASY"), {
    id: "EASY",
    name: "easy",
    value: 1,
  });
  is.same(subject.getDifficulty("MEDIUM"), {
    id: "MEDIUM",
    name: "medium",
    value: 2,
  });
  is.same(subject.getDifficulty("HARD"), {
    id: "HARD",
    name: "hard",
    value: 3,
  });
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
    TaskFactory({
      dueDate: parseISO("2020-09-02"),
      index: 0,
    })
  );
  subject.createTask(
    TaskFactory({
      dueDate: parseISO("2020-10-05"),
      index: 0,
    })
  );
  subject.moveTask(id, parseISO("2020-10-05"));
  const taskStream = subject.getTask(id);
  is.same(taskStream().dueDate, parseISO("2020-10-05"));
  is.same(taskStream().position, 2);
});

t.test("#changeTaskPosition reorders tasks", async (is) => {
  const dueDate = "2020-09-02";
  const subject = Subject({ now: () => parseISO("2020-09-01") });
  const task1 = subject.createTask(
    TaskFactory({
      dueDate: parseISO(dueDate),
      index: 0,
    })
  );
  const task2 = subject.createTask(
    TaskFactory({
      dueDate: parseISO(dueDate),
      index: 1,
    })
  );
  const task3 = subject.createTask(
    TaskFactory({
      dueDate: parseISO(dueDate),
      index: 2,
    })
  );
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
    const createCompletedTask = ({ difficulty, dueDate }) => {
      const task = subject.createTask(
        TaskFactory({
          difficulty,
          index: 0,
        })
      );
      subject.updateTask(task.id, {
        dueDate,
        isComplete: true,
      });

      return task;
    };

    is.same(subject.recommendedDifficulty(), 3, "defaults value to 3");

    createCompletedTask({
      difficulty: "EASY",
      dueDate: parseISO("2020-08-01"),
    });

    is.same(subject.recommendedDifficulty(), 3, "minimum of 3");

    createCompletedTask({
      difficulty: "MEDIUM",
      dueDate: parseISO("2020-08-01"),
    });
    createCompletedTask({
      difficulty: "HARD",
      dueDate: parseISO("2020-08-02"),
    });
    createCompletedTask({
      difficulty: "HARD",
      dueDate: parseISO("2020-08-02"),
    });

    is.same(
      subject.recommendedDifficulty(),
      4,
      "even number of days, floors median"
    );

    createCompletedTask({
      difficulty: "HARD",
      dueDate: parseISO("2020-08-03"),
    });

    is.same(subject.recommendedDifficulty(), 3, "odd number of days");
  }
);
