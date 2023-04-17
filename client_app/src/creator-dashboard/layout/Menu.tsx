import {
  Group,
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Text,
  Box,
  useMantineTheme,
  Avatar,
} from "@mantine/core";
import React from "react";
import { Home as HomeIcon } from "@styled-icons/boxicons-regular/Home";
import { File as ProjectIcon } from "@styled-icons/boxicons-solid/File";
import { Bank as BankIcon } from "@styled-icons/boxicons-solid/Bank";
import Button from "../../components/common/Button";
import { useAppSelector } from "../../store/hooks";
import { selectUserProfile } from "../../slices/userSlice";
import { Link } from "react-router-dom";

const menuItems = [
  { label: "Home", color: "blue", icon: <HomeIcon />, to: "" },
  {
    label: "Your Campaigns",
    color: "yellow",
    icon: <ProjectIcon />,
    to: "projects",
  },
  { label: "Finances", color: "blue", icon: <BankIcon />, to: "finances" },
];

const Menu = () => {
  const userData = useAppSelector(selectUserProfile);

  return (
    <>
      <Navbar.Section>
        <Box style={{ paddingBottom: 16, borderBottom: "1px solid grey" }}>
          <Button
            rounded="full"
            color="violet400"
            style={{ padding: 15, fontSize: 16 }}
          >
            + NEW PROJECT
          </Button>
        </Box>
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        {menuItems.map(({ label, color, icon, to }) => (
          <Link
            key={label}
            style={{
              textDecoration: "none",
            }}
            to={to}
          >
            <MainLink label={label} color={color} icon={icon} />
          </Link>
        ))}
      </Navbar.Section>
      <Navbar.Section>
        <UserSection name={userData.firstName + " " + userData.lastName} />
      </Navbar.Section>
    </>
  );
};

export default Menu;

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  selected?: boolean;
}

const MainLink = ({ icon, color, label, selected }: MainLinkProps) => {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        ...(selected && { background: theme.colors.dark[6] }),
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light" style={{ padding: 2 }}>
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const UserSection = ({ name = "", email = "" }) => {
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Avatar
            src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            radius="xl"
          />
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>
            <Text color="dimmed" size="xs">
              {email}ceva@gmail.com
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
};
