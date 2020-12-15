import t from "tap";
import Persistence from "../persistence";
import { parseISO } from "date-fns";
import { InMemoryBackend } from "../backends";

const Subject = (attrs = {}) =>
  Persistence({ backend: InMemoryBackend(), ...attrs });

t.test(
  "#tasksByDisplayDate is an observable containing all deserialized tasks, partitioned by dueDate and sorted by position",
  async (is) => {
    const subject = Subject({ now: () => parseISO("2020-09-01") });
    const task1 = subject.createTask({
      text: "thing 1",
      dueDate: parseISO("2020-09-02"),
      isImportant: false,
      difficulty: "EASY",
      index: 0,
    });
    const task2 = subject.createTask({
      text: "thing 2",
      dueDate: parseISO("2020-09-05"),
      isImportant: false,
      difficulty: "EASY",
      index: 1,
    });
    const task3 = subject.createTask({
      text: "thing 3",
      dueDate: parseISO("2020-09-05"),
      isImportant: false,
      difficulty: "EASY",
      index: 0,
    });
    const actual = subject.tasksByDisplayDate();
    is.same(actual, {
      "2020-09-02": [task1],
      "2020-09-05": [task3, task2],
    });
  }
);

t.test("#deleteTask deletes a task", async (is) => {
  const subject = Subject();
  const task = subject.createTask({
    text: "thing 1",
    dueDate: parseISO("2020-09-02"),
    isImportant: false,
    difficulty: "EASY",
    index: 0,
  });
  is.same(subject.tasks().length, 1);
  subject.deleteTask(task.id);
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
  const { id } = subject.createTask({
    text: "Do the dishes",
    dueDate: parseISO("2020-09-02"),
    isImportant: false,
    difficulty: "MEDIUM",
    index: 0,
  });
  subject.updateTask(id, { text: "Mow the lawn" });
  is.same(subject.getTask(id)().text, "Mow the lawn");
});

t.test("#toggleTask toggles a task's completed state", async (is) => {
  const subject = Subject();
  const { id } = subject.createTask({
    text: "Do the dishes",
    dueDate: parseISO("2020-09-02"),
    isImportant: false,
    difficulty: "MEDIUM",
    index: 0,
  });
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
    const { id } = subject.createTask({
      text: "Do the dishes",
      dueDate: parseISO("2020-08-04"),
      isImportant: false,
      difficulty: "MEDIUM",
      index: 0,
    });
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
  const { id } = subject.createTask({
    text: "Do the dishes",
    dueDate: parseISO("2020-09-02"),
    isImportant: false,
    difficulty: "MEDIUM",
    index: 0,
  });
  subject.createTask({
    text: "Mow the lawn",
    dueDate: parseISO("2020-10-05"),
    isImportant: false,
    difficulty: "MEDIUM",
    index: 0,
  });
  subject.moveTask(id, parseISO("2020-10-05"));
  const taskStream = subject.getTask(id);
  is.same(taskStream().dueDate, parseISO("2020-10-05"));
  is.same(taskStream().position, 2);
});

t.todo("#changeTaskPosition");

t.todo("#recommendedDifficulty");
