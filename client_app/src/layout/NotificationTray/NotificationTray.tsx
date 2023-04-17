import React, { useEffect } from "react";
import IconButton from "../../components/common/IconButton";
import { Bell as BellIcon } from "@styled-icons/boxicons-regular/Bell";
import { theme } from "../../theme";
import { Popover } from "../../components/common/Popover";
import {
  Badge,
  NotifcationTrayTitle,
  NotificationDismissButton,
  NotificationItem,
  NotificationTrayBody,
} from "./NotificationTray.style";
import { Cross2Icon } from "@radix-ui/react-icons";
import ScrollArea from "../../components/common/ScrollArea";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  notificationActions,
  selectNotifications,
} from "../../slices/notificationsSlice";
import { selectUserProfile } from "../../slices/userSlice";
import { RightArrowAlt as ArrowIcon } from "@styled-icons/boxicons-regular/RightArrowAlt";
import { Link } from "react-router-dom";
import { projectActions } from "../../slices/projectSlice";

const NotificationTray = () => {
  const notifications = useAppSelector(selectNotifications).notifications;

  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);

  useEffect(() => {
    if (userProfile.id)
      dispatch(notificationActions.fetchNotifications(userProfile.id));
  }, [userProfile.id, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(notificationActions.reset());
    };
  }, [dispatch]);

  return (
    <Popover
      placement="bottom-end"
      css={{ padding: "20px 5px 10px 5px" }}
      trigger={
        <IconButton
          ring
          css={{
            padding: 10,
            position: "relative",
            color: theme.colors.white,
            boxShadow: "0 2px 10px var(--shadows-boxShadowColor1)",
            background: "var(--colors-violet400)",
            borderRadius: 10,
          }}
        >
          <Badge>{notifications.length}</Badge>
          <BellIcon size={20} />
        </IconButton>
      }
    >
      <NotificationTrayBody>
        <NotifcationTrayTitle>Notifications</NotifcationTrayTitle>
        <ScrollArea maxHeight={250} type="auto">
          {!notifications.length && (
            <h3 style={{ padding: 10 }}>No notifications</h3>
          )}
          {notifications.map((item) => (
            <NotificationItem key={item.id}>
              <Link
                to={`/project/${item.projectId}`}
                onClick={() => dispatch(projectActions.reset())}
              >
                <NotificationDismissButton>
                  <ArrowIcon size={25} />
                </NotificationDismissButton>
              </Link>
              {item.message}
            </NotificationItem>
          ))}
        </ScrollArea>
      </NotificationTrayBody>
    </Popover>
  );
};

export default React.memo(NotificationTray);
