import { TableClassNames } from "../types";

/**
 * An object containing the default BEM-style class names that map to the
 * optional stylesheet. This is used internally to make the table work
 * out-of-the-box when the user imports `@flowers/nextjs-table/styles`.
 */
export const flowersDefaultClassNames: TableClassNames = {
  container: "next-table__container",
  table: "next-table__table",
  thead: "next-table__thead",
  th: "next-table__th",
  tbody: "next-table__tbody",
  tr: "next-table__tr",
  td: "next-table__td",
  resizer: "next-table__resizer",
  pagination: {
    container: "next-table-pagination__container",
    button: "next-table-pagination__button",
    buttonDisabled: "next-table-pagination__button--disabled",
    pageInfo: "next-table-pagination__info",
  },
  actionDropdown: {
    container: "next-table-action__container",
    button: "next-table-action__button",
    menu: "next-table-action__menu",
    item: "next-table-action__item",
  },
};
