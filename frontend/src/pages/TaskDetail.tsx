import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { getTask } from "src/api/tasks";
import { Button, Page, TaskForm } from "src/components";
import styles from "src/pages/TaskDetail.module.css";

import type { Task } from "src/api/tasks";

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Provide a Task ID in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getTask(id)
      .then((result) => {
        if (result.success) {
          setTask(result.data);
        } else {
          setError(result.error || "Failed to retrieve the task.");
        }
      })
      .catch((err) => {
        setError(err.message || "An unexpected error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <Page>
        <Helmet>
          <title>Error | TSE Todos</title>
        </Helmet>
        <p>
          <Link to="/">Back to Home</Link>
        </p>
        <p>{"This task doesn't exist!"}</p>
      </Page>
    );
  }

  if (!task) {
    return (
      <Page>
        <Helmet>
          <title>Task Not Found | TSE Todos</title>
        </Helmet>
        <p>
          <Link to="/">Back to Home</Link>
        </p>
        <p>{"This task doesn't exist!"}</p>
      </Page>
    );
  }

  return (
    <Page>
      <Helmet>
        <title> {task.title} | TSE Todos</title>
      </Helmet>
      <div className={styles.container}>
        <p>
          {" "}
          <Link to="/">Back to Home</Link>{" "}
        </p>
        {editMode ? (
          <TaskForm mode="edit" task={task} />
        ) : (
          <>
            <div className={styles.top}>
              <h1> {task.title} </h1>
              <Button
                className={styles.topButton}
                label={editMode ? "Cancel" : "Edit Task"}
                onClick={() => setEditMode((prev) => !prev)}
              />
            </div>
            <p className={styles.description}>{task.description || "(No description)"}</p>
            <div className={styles.fieldRow}>
              <p className={styles.field}>Assignee</p>
              <p className={styles.value}>{task.assignee ? task.assignee.name : "Unassigned"}</p>
            </div>
            <div className={styles.fieldRow}>
              <p className={styles.field}>Status</p>
              <p className={styles.value}>{task.isChecked ? "Done" : "Not done"}</p>
            </div>
            <div className={styles.fieldRow}>
              <p className={styles.field}>Date created</p>
              <p className={styles.value}>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }).format(new Date(task.dateCreated))}
              </p>
            </div>
          </>
        )}
      </div>
    </Page>
  );
}
