import { useState } from "react";
import { updateTask } from "src/api/tasks";
import { CheckButton } from "src/components";
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
    updateTask({ ...task, isChecked: !task.isChecked })
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
        <span className={styles.title}>{task.title}</span>
        {task.description && <span className={styles.description}> {task.description} </span>}
      </div>
    </div>
  );
}
