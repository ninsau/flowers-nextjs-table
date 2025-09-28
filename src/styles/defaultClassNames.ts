import type { TableClassNames } from "../types";

/**
 * An object containing the default BEM-style class names that map to the
 * optional stylesheet.
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
    buttonDisabled:
      "next-table-pagination__button next-table-pagination__button--disabled",
    pageButton: "next-table-pagination__page-button",
    activePageButton: "next-table-pagination__page-button next-table-pagination__page-button--active",
    pageInfo: "next-table-pagination__info",
  },
  actionDropdown: {
    container: "next-table-action",
    button: "next-table-action__button",
    menu: "next-table-action__menu",
    item: "next-table-action__item",
  },
  chip: {
    container: "chip-display__container",
    chip: "chip-display__chip",
    moreButton: "chip-display__more-button",
  },
  expandableText: {
    toggleButton: "expandable-text__toggle-button",
  },
};
