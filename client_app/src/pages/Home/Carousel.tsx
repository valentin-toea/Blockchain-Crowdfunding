import React, { ReactElement, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import IconButton from "../../components/common/IconButton";

import "./Home.scss";
import { LeftArrowCircle as LeftArrowIcon } from "@styled-icons/boxicons-regular/LeftArrowCircle";
import { RightArrowCircle as RightArrowIcon } from "@styled-icons/boxicons-regular/RightArrowCircle";
import { theme } from "../../theme";

const Carousel = ({ items = [] }: { items: any[] }) => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <ScrollMenu
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
        options={{
          ratio: 0.9,
          rootMargin: "5px",
          threshold: [0.01, 0.05, 0.5, 0.75, 0.95, 1],
        }}
      >
        {items.map((item, index) => (
          <ItemHolder
            key={index}
            itemId={index.toString()}
            noMargin={index === 0}
          >
            {item}
          </ItemHolder>
        ))}
      </ScrollMenu>
    </div>
  );
};

export default Carousel;

const ItemHolder: React.FC<{ itemId: string; noMargin?: boolean }> = ({
  itemId,
  children,
  noMargin = false,
}) => {
  return (
    <div
      style={{
        height: "100%",
        margin: noMargin ? "0px 10px 0px 0px" : "0 10px",
        padding: "10px 0",
      }}
    >
      {children}
    </div>
  );
};

function LeftArrow() {
  const {
    getItemById,
    getPrevItem,
    isFirstItemVisible,
    scrollToItem,
    visibleItemsWithoutSeparators,
    initComplete,
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

  // NOTE: for scroll 1 item
  const clickHandler = () => {
    /* const prevItem = getPrevItem();
    scrollToItem(prevItem?.entry?.target, "smooth", "start");
    */
    scrollToItem(
      getItemById(visibleItemsWithoutSeparators.slice(-3)[0]),
      "smooth",
      "end"
    );
  };

  return (
    <IconButton
      css={{ marginRight: 10 }}
      disabled={isFirstItemVisible}
      onClick={clickHandler}
    >
      <LeftArrowIcon
        size={50}
        style={{ color: theme.colors.violet300.toString() }}
      />
    </IconButton>
  );
}

function RightArrow() {
  const {
    getItemById,
    getNextItem,
    isLastItemVisible,
    scrollToItem,
    visibleItemsWithoutSeparators,
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !visibleItemsWithoutSeparators.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleItemsWithoutSeparators]);

  // NOTE: for scroll 1 item
  const clickHandler = () => {
    //const nextItem = getNextItem();
    //scrollToItem(nextItem?.entry?.target, "smooth", "end");

    scrollToItem(
      getItemById(visibleItemsWithoutSeparators[2]),
      "smooth",
      "start"
    );
  };

  return (
    <IconButton
      css={{ marginLeft: 10 }}
      disabled={isLastItemVisible}
      onClick={clickHandler}
    >
      <RightArrowIcon
        size={50}
        style={{ color: theme.colors.violet300.toString() }}
      />
    </IconButton>
  );
}
