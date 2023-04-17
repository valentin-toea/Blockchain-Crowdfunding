import React from "react";
import { Toolbar, ToolbarToggleGroup, ToolbarToggleItem } from "./style";
import { GridOutline } from "@styled-icons/evaicons-outline/GridOutline";
import { Speakerphone } from "@styled-icons/heroicons-outline/Speakerphone";
import { Money } from "@styled-icons/fluentui-system-filled/Money";
import { Link } from "react-router-dom";

const menuItems = [
  { name: "Home", link: "/", Icon: GridOutline },
  { name: "Announcements", link: "/account", Icon: Speakerphone },
  { name: "Money", link: "/dada", Icon: Money },
];

const Sidebar = () => {
  return (
    <div>
      <Toolbar aria-label="Formatting options">
        <ToolbarToggleGroup type="single" defaultValue="Home">
          {menuItems.map(({ name, link, Icon }) => (
            <ToolbarToggleItem
              asChild
              key={name}
              value={link}
              aria-label={`menu-${name}`}
            >
              <Link to={link}>
                <Icon size={22} />
              </Link>
            </ToolbarToggleItem>
          ))}
        </ToolbarToggleGroup>
      </Toolbar>
    </div>
  );
};

export default Sidebar;
