import { useState } from "react";
import { Link } from "react-router-dom";
import { updateTask } from "src/api/tasks";
import { CheckButton, UserTag } from "src/components";
import styles from "src/components/TaskItem.module.css";

import type { Task } from "src/api/tasks";

export interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task: initialTask }: TaskItemProps) {
  let wrapperclass = styles.textContainer;

  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleToggleCheck = () => {
    setLoading(true);
    updateTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      isChecked: !task.isChecked,
      dateCreated: task.dateCreated,
      assignee: task.assignee ? task.assignee._id : undefined, // Ensure `assignee` is set as a string if defined
    })
      .then((result) => {
        if (result.success) {
          setTask(result.data);
        } else {
          alert(result.error);
        }
        setLoading(false);
      })
      .catch((reason) => alert(reason));
  };

  if (task.isChecked) {
    wrapperclass += " " + styles.checked;
  }

  return (
    <div className={styles.item}>
      <CheckButton onPress={handleToggleCheck} disabled={isLoading} checked={task.isChecked} />
      <div className={wrapperclass}>
        <Link to={`/task/${task._id}`} className={styles.title}>
          {task.title}
        </Link>
        {task.description && <span className={styles.description}> {task.description} </span>}
      </div>
      <div>
        <UserTag user={task.assignee} />
      </div>
    </div>
  );
}
