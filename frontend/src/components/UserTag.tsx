// import styles from "src/components/UserTag.module.css";

import type { User } from "src/api/users";

export interface UserItemProps {
  user: User | undefined;
}

export function UserTag({ user }: UserItemProps) {
  return (
    <div>
      <img
        src={user?.profilePictureURL ? user?.profilePictureURL : "/userDefault.svg"}
        alt={"img"}
      />
      <span>{user?.name || "Not Assigned"}</span>
    </div>
  );
}
