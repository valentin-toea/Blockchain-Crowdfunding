import React, { useState } from "react";
import { Link } from "react-router-dom";
import { theme } from "../../theme";
import { CATEGORIES } from "../../utils";
import {
  LinkText,
  LinkTitle,
  ListItem,
  NavigationMenuLink,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  ContentList,
  NavigationMenuIndicator,
  ViewportPosition,
  NavigationMenuViewport,
} from "./TopNavigationMenu.style";

export const ContentListItem = React.forwardRef<React.ForwardedRef<any>, any>(
  ({ children, title, ...props }, forwardedRef) => (
    <ListItem>
      <NavigationMenuLink
        {...props}
        ref={forwardedRef}
        css={{
          padding: 12,
          borderRadius: 6,
          "&:hover": { backgroundColor: "#e2dbffa1" },
        }}
      >
        <LinkTitle>{title}</LinkTitle>
        <LinkText css={{ color: theme.colors.dark200 }}>{children}</LinkText>
      </NavigationMenuLink>
    </ListItem>
  )
);

export const ContentListItemCallout = React.forwardRef<
  React.ForwardedRef<any>,
  any
>(({ children, ...props }, forwardedRef) => (
  <ListItem css={{ gridRow: "span 3" }}>
    <NavigationMenuLink
      {...props}
      href="/"
      ref={forwardedRef}
      css={{
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${theme.colors.violet400} 0%, ${theme.colors.neutral200} 100%);`,
        borderRadius: 6,
        padding: 25,
      }}
    >
      <svg aria-hidden width="38" height="38" viewBox="0 0 25 25" fill="white">
        <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
        <path d="M12 0H4V8H12V0Z"></path>
        <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
      </svg>
      <LinkTitle
        css={{
          fontSize: 18,
          color: "white",
          marginTop: 16,
          marginBottom: 7,
        }}
      >
        Radix Primitives
      </LinkTitle>
      <LinkText
        css={{
          fontSize: 14,
          color: theme.colors.violet400,
          lineHeight: 1.3,
        }}
      >
        Unstyled, accessible components for React.
      </LinkText>
    </NavigationMenuLink>
  </ListItem>
));

const TopNavigationMenu = () => {
  const [value, setValue] = useState<any>();
  return (
    <NavigationMenu value={value} onValueChange={setValue}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/campaigns" style={{ textDecoration: "none" }}>
            <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          </Link>
          <NavigationMenuContent>
            <ContentList layout="one">
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  style={{ textDecoration: "none" }}
                  to={`/campaigns#categories=${category}`}
                  onClick={() => setValue("none")}
                >
                  <ContentListItem title={category}></ContentListItem>
                </Link>
              ))}
            </ContentList>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuContent>
            <ContentList layout="two">
              <ContentListItem
                title="Introduction"
                href="/docs/primitives/overview/introduction"
              >
                Build high-quality, accessible design systems and web apps.
              </ContentListItem>
              <ContentListItem
                title="Getting started"
                href="/docs/primitives/overview/getting-started"
              >
                A quick tutorial to get you up and running with Radix
                Primitives.
              </ContentListItem>
              <ContentListItem
                title="Styling"
                href="/docs/primitives/overview/styling"
              >
                Unstyled and compatible with any styling solution.
              </ContentListItem>
              <ContentListItem
                title="Animation"
                href="/docs/primitives/overview/animation"
              >
                Use CSS keyframes or any animation library of your choice.
              </ContentListItem>
              <ContentListItem
                title="Accessibility"
                href="/docs/primitives/overview/accessibility"
              >
                Tested in a range of browsers and assistive technologies.
              </ContentListItem>
              <ContentListItem
                title="Releases"
                href="/docs/primitives/overview/releases"
              >
                Radix Primitives releases and their changelogs.
              </ContentListItem>
            </ContentList>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuIndicator />
      </NavigationMenuList>

      <ViewportPosition>
        <NavigationMenuViewport />
      </ViewportPosition>
    </NavigationMenu>
  );
};

export default TopNavigationMenu;
