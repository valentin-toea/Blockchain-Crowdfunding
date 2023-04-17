import { Loader } from "@mantine/core";
import { styled } from "@stitches/react";
import React, { ReactNode } from "react";
import { Column, useFlexLayout, useTable } from "react-table";
import { theme } from "../../theme";

interface TableProps {
  columns: Column<object>[];
  data: object[];
  css?: object;
  footer?: ReactNode;
  loading?: boolean;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  css,
  footer,
  loading,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useFlexLayout
    );

  // Render the UI for your table
  return (
    <Styles css={{ ...css }}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading && (
            <tr
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 100,
                padding: 20,
              }}
            >
              <td
                style={{
                  padding: "15px 30px",
                  borderRadius: 10,
                  background: "rgba(0, 0, 0, 0.05)",
                }}
              >
                <Loader size="xl" color="grey" />
              </td>
            </tr>
          )}
          {!loading && data.length === 0 && (
            <tr
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 170,
              }}
            >
              <td
                style={{
                  padding: "15px 30px",
                  borderRadius: 10,
                  background: "rgb(247, 247, 247)",
                }}
              >
                <b>No Data</b>
              </td>
            </tr>
          )}
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {footer && (
        <div
          style={{
            padding: "15px 15px 0px 15px",
            borderTop: `1px solid #b2b3bd4d`,
          }}
        >
          {footer}
        </div>
      )}
    </Styles>
  );
};

export default Table;

const Styles = styled("div", {
  // border: `1px solid ${theme.colors.neutral100}`,
  boxShadow: theme.shadows.boxShadow1,
  borderRadius: 10,
  width: "fit-content",
  overflow: "hidden",
  background: "white",

  table: {
    borderSpacing: 0,

    tr: {
      "&:last-child": {
        td: {
          borderBottom: 0,
        },
      },
    },

    tbody: {
      background: "white",
    },

    "thead > tr": {
      background: "#F7F7F7",
      boxShadow: theme.shadows.boxShadow1,
    },

    "th,td": {
      textAlign: "start",
      margin: 0,
      padding: "0.9rem 1rem",

      "&:last-child": {
        borderRight: 0,
      },
    },
  },
});
