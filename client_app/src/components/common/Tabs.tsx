import React, { useEffect, useState } from "react";
import { styled } from "@stitches/react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { theme } from "../../theme";

const StyledTabs = styled(TabsPrimitive.Root, {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});

const StyledList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: "flex",
  background: "transparent",
  gap: 40,
});

const StyledTrigger = styled(TabsPrimitive.Trigger, {
  maxWidth: "fit-content",
  minWidth: 100,
  fontFamily: "inherit",
  backgroundColor: "transparent",
  height: 45,
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  lineHeight: 1,
  color: "black",
  userSelect: "none",
  cursor: "pointer",
  "&:first-child": { borderTopLeftRadius: 6 },
  "&:last-child": { borderTopRightRadius: 6 },
  '&[data-state="active"]': {
    color: theme.colors.violet400,
    boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
  },
});

const StyledContent = styled(TabsPrimitive.Content, {
  flexGrow: 1,
  padding: "20px 0",
  backgroundColor: "transparent",
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  outline: "none",
});

const TabsList = StyledList;
const TabsTrigger = StyledTrigger;
export const TabsContent = StyledContent;

interface TabsProps {
  tabList: string[];
  minHeight?: number | string;
  extraOnClick?: (tabName?: string) => any;
  extraActionIndex?: number[];
  value?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabList,
  children,
  value,
  minHeight,
  extraOnClick,
  extraActionIndex,
}) => {
  const [_value, _setValue] = useState<string>();

  useEffect(() => {
    value &&
      tabList.some((elem) => elem.toLowerCase() === value.toLowerCase()) &&
      _setValue(value);
  }, [value, tabList]);

  return (
    <StyledTabs
      value={
        _value &&
        tabList.some((elem) => elem.toLowerCase() === _value.toLowerCase())
          ? tabList.find((elem) => elem.toLowerCase() === _value.toLowerCase())
          : tabList.length > 0
          ? tabList[0]
          : ""
      }
      onValueChange={_setValue}
      style={{ minHeight }}
    >
      <TabsList aria-label="Manage your account">
        {tabList.map((tabName, index) => (
          <TabsTrigger key={index} value={tabName}>
            {extraActionIndex?.some((_index) => _index === index) ? (
              <div onClick={() => extraOnClick?.(tabName)}>
                <b>{tabName}</b>
              </div>
            ) : (
              <b>{tabName}</b>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </StyledTabs>
  );
};

export default Tabs;
