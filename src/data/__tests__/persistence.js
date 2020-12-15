import t from "tap";
import Persistence from "../persistence";
import { parseISO } from "date-fns";
import { InMemoryBackend } from "../backends";

t.test(
  "#tasksByDisplayDate is an observable containing all deserialized tasks, partitioned by dueDate and sorted by position",
  async (is) => {
    const subject = Persistence({
      backend: InMemoryBackend(),
      now: () => parseISO("2020-09-01"),
    });
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
  const subject = Persistence({
    backend: InMemoryBackend(),
    now: () => parseISO("2020-09-01"),
  });
  const task = subject.createTask({
    text: "thing 1",
    dueDate: parseISO("2020-09-02"),
    isImportant: false,
    difficulty: "EASY",
    index: 0,
  });
  is.same(subject.tasks(), [task]);
  subject.deleteTask(task.id);
  is.same(subject.tasks(), []);
});

t.test(
  "#createTask creates a task, setting originalDueDate, position, and createdAt",
  async (is) => {
    const now = parseISO("2020-09-01");
    const subject = Persistence({
      backend: InMemoryBackend(),
      now: () => now,
    });
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
  const subject = Persistence({
    backend: InMemoryBackend(),
    now: () => parseISO("2020-09-01"),
  });
  const task = subject.createTask({
    text: "Do the dishes",
    dueDate: parseISO("2020-09-02"),
    isImportant: false,
    difficulty: "MEDIUM",
    index: 0,
  });
  subject.updateTask(task.id, { text: "Mow the lawn" });
  is.same(subject.tasks(), [{ ...task, text: "Mow the lawn" }]);
});

t.test("#toggleTask toggles a task's completed state", async (is) => {
  const subject = Persistence({
    backend: InMemoryBackend(),
    now: () => parseISO("2020-09-01"),
  });
  const { id } = subject.createTask({
    text: "Do the dishes",
    dueDate: parseISO("2020-09-02"),
    isImportant: false,
    difficulty: "MEDIUM",
    index: 0,
  });
  subject.toggleTask(id);
  is.same(subject.tasks()[0].isComplete, true);
  subject.toggleTask(id);
  is.same(subject.tasks()[0].isComplete, false);
});

t.test(
  "#refreshTask updates a task's originalDueDate to its current dueDate",
  async (is) => {
    const now = parseISO("2020-09-01");
    const subject = Persistence({
      backend: InMemoryBackend(),
      now: () => now,
    });
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
