import { type FC, useState } from "react";
import { List, Popover } from "antd";
import clsx from "clsx";

import { UserAvatar } from "../user-avatar";

import styles from "./index.module.css";
import { Link } from "react-router-dom";

type Props = {
  className?: string;
  dataTestId?: string;
};

export const UserPanel: FC<Props> = ({
  className,
  dataTestId = "user-avatar",
}) => {
  const [open, setOpen] = useState(false);
  const userName = "userName";

  const togglePopover = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <Popover
      open={open}
      placement="bottomRight"
      trigger="click"
      showArrow={false}
      onOpenChange={togglePopover}
      content={
        <List size="small">
          <Link to={'/login'}><List.Item>Logout</List.Item></Link>
        </List>
      }
      arrow={false}
    >
      <UserAvatar
        size={32}
        className={clsx(className, styles.avatar)}
        userName={userName}
        aria-label={open ? "Hide user menu" : "Show user menu"}
        dataTestId={dataTestId}
      />
    </Popover>
  );
};
