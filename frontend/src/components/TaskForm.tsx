import { useEffect, useState } from "react";
import { createTask, updateTask } from "src/api/tasks";
import { getUser } from "src/api/users";
import { Button, TextField } from "src/components";
import styles from "src/components/TaskForm.module.css";

import type { Task } from "src/api/tasks";
import type { User } from "src/api/users";

export interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  onSubmit?: (task: Task) => void;
}

/**
 * A simple way to handle error states in the form. We'll keep a
 * `TaskFormErrors` object in the form's state, initially empty. Before we
 * submit a request, we'll check each field for problems. For each invalid
 * field, we set the corresponding field in the errors object to true, and the
 * corresponding input component will show its error state if the field is true.
 * Look at where the `errors` object appears below for demonstration.
 *
 * In the MVP, the only possible error in this form is that the title is blank,
 * so this is slightly overengineered. However, a more complex form would need
 * a similar system.
 */
interface TaskFormErrors {
  title?: boolean;
}

/**
 * The form that creates or edits a Task object. In the MVP, this is only
 * capable of creating Tasks.
 *
 * @param props.mode Controls how the form renders and submits
 * @param props.task Optional initial data to populate the form with (such as
 * when we're editing an existing task)
 * @param props.onSubmit Optional callback to run after the user submits the
 * form and the request succeeds
 */
export function TaskForm({ mode, task, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(task?.description || "");
  const [id, setID] = useState<string>(task?.assignee?._id || ""); // store as string initially
  const [assignee, setAssignee] = useState<User | undefined>(task?.assignee || undefined); // state to store the User object
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  // Fetch user by ID when the ID changes
  useEffect(() => {
    if (!id) {
      setAssignee(undefined); // Clear assignee if ID is empty
      return;
    }

    let isMounted = true; // flag to track if component is still mounted

    getUser(id)
      .then((result) => {
        if (isMounted) {
          // Only update state if the component is mounted
          if (result.success) {
            setAssignee(result.data);
          } else {
            setAssignee(undefined);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to fetch user:", err);
          setAssignee(undefined);
        }
      });

    return () => {
      isMounted = false; // Cleanup on component unmount
    };
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    if (title.length === 0) {
      setErrors({ title: true });
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        title,
        description,
        assignee: assignee ? assignee._id : undefined,
      };

      if (mode === "create") {
        const result = await createTask(taskData);
        if (result.success) {
          setTitle("");
          setDescription("");
          setID("");
          setAssignee(undefined);
          if (onSubmit) onSubmit(result.data);
        } else {
          alert(result.error);
        }
      } else if (mode === "edit") {
        const result = await updateTask({
          ...taskData,
          _id: task!._id,
          isChecked: task!.isChecked,
          dateCreated: task!.dateCreated,
        });
        if (result.success) {
          setID("");
          setAssignee(undefined);
          if (onSubmit) onSubmit(result.data);
        } else {
          alert(result.error);
        }
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = mode === "create" ? "New task" : "Edit task";

  return (
    <form className={styles.form}>
      <span className={styles.formTitle}>{formTitle}</span>
      <div className={styles.formRow}>
        <TextField
          className={styles.textField}
          data-testid="task-title-input"
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="task-description-input"
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="id-input"
          label="Assignee ID (optional)"
          value={id}
          onChange={(event) => setID(event.target.value)}
        />
        {assignee && <div className={styles.assigneePreview}>{assignee.name}</div>}
        <Button
          kind="primary"
          type="button"
          data-testid="task-save-button"
          label="Save"
          disabled={isLoading}
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
}
