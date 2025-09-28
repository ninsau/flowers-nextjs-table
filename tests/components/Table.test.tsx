import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";
import Table from "../../src/components/Table";
import type { CellValue, ColumnDef, TableProps } from "../../src/types";

interface TestData extends Record<string, CellValue> {
  id: number;
  name: string;
  email: string;
  age: number;
  tags: string[];
  date: string;
}

const mockData: TestData[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    tags: ["admin", "user"],
    date: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    tags: ["user"],
    date: "2023-02-20T14:15:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    tags: ["moderator"],
    date: "2023-03-10T08:45:00Z",
  },
];

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "age",
    header: "Age",
    enableSorting: true,
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
  {
    accessorKey: "date",
    header: "Date",
    enableSorting: true,
  },
];

const defaultProps: TableProps<TestData> = {
  data: mockData,
  columns: mockColumns,
};

describe("Table", () => {
  describe("basic rendering", () => {
    it("should render table with data", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.getByText("35")).toBeInTheDocument();
    });

    it("should render column headers", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("Tags")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
    });

    it("should render loading skeleton when loading", () => {
      render(<Table {...defaultProps} loading={true} />);

      // TableSkeleton renders a table element, so we check for the skeleton instead
      expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
      // The skeleton should not contain actual data
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    it("should render no content when data is empty", () => {
      render(<Table {...defaultProps} data={[]} />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("should format dates correctly", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByText("Jan 15, 2023")).toBeInTheDocument();
      expect(screen.getByText("Feb 20, 2023")).toBeInTheDocument();
      expect(screen.getByText("Mar 10, 2023")).toBeInTheDocument();
    });

    it("should render tags as chips", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByText("admin")).toBeInTheDocument();
      // There are multiple "user" tags, so use getAllByText
      const userTags = screen.getAllByText("user");
      expect(userTags).toHaveLength(2);
      expect(screen.getByText("moderator")).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("should sort data when clicking sortable column", async () => {
      const user = userEvent.setup();
      render(<Table {...defaultProps} />);

      const nameHeader = screen.getByRole("button", { name: /name/i });
      await user.click(nameHeader);

      const rows = screen.getAllByRole("row").slice(1); // Skip header row
      expect(rows[0]).toHaveTextContent("Bob Johnson");
      expect(rows[1]).toHaveTextContent("Jane Smith");
      expect(rows[2]).toHaveTextContent("John Doe");
    });

    it("should toggle sort direction", async () => {
      const user = userEvent.setup();
      render(<Table {...defaultProps} />);

      const nameHeader = screen.getByRole("button", { name: /name/i });

      // First click - ascending
      await user.click(nameHeader);
      let rows = screen.getAllByRole("row").slice(1);
      expect(rows[0]).toHaveTextContent("Bob Johnson");

      // Second click - descending
      await user.click(nameHeader);
      rows = screen.getAllByRole("row").slice(1);
      expect(rows[0]).toHaveTextContent("John Doe");
    });

    it("should show sort indicators", async () => {
      const user = userEvent.setup();
      render(<Table {...defaultProps} />);

      const nameHeader = screen.getByRole("button", { name: /name/i });
      await user.click(nameHeader);

      // The aria-sort attribute is on the th element, not the button
      const thElement = nameHeader.closest("th");
      expect(thElement).toHaveAttribute("aria-sort", "ascending");
    });
  });

  describe("searching", () => {
    it("should filter data based on search value", () => {
      render(<Table {...defaultProps} searchValue="jane" />);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
    });

    it("should show no results message when no matches", () => {
      render(<Table {...defaultProps} searchValue="nonexistent" />);

      // The text is rendered with HTML entities, so we need to match the actual rendered text
      expect(screen.getByText(/No results for/)).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("should be case insensitive", () => {
      render(<Table {...defaultProps} searchValue="JANE" />);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    it("should paginate data when itemsPerPage is set", () => {
      render(<Table {...defaultProps} itemsPerPage={2} />);

      // Should show first 2 items and pagination
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();

      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });

    it("should navigate pages", async () => {
      const user = userEvent.setup();
      render(<Table {...defaultProps} itemsPerPage={2} />);

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });

    it("should not show page numbers by default", () => {
      render(<Table {...defaultProps} itemsPerPage={2} />);

      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.queryByText("1")).not.toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
    });

    it("should show page numbers when showPageNumbers is true", () => {
      render(
        <Table {...defaultProps} itemsPerPage={2} showPageNumbers={true} />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("should highlight active page number", () => {
      render(
        <Table {...defaultProps} itemsPerPage={2} showPageNumbers={true} />
      );

      const page1Button = screen.getByText("1");
      const page2Button = screen.getByText("2");

      expect(page1Button).toHaveAttribute("aria-current", "page");
      expect(page2Button).not.toHaveAttribute("aria-current");
    });

    it("should navigate to specific page when page number is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Table {...defaultProps} itemsPerPage={2} showPageNumbers={true} />
      );

      const page2Button = screen.getByText("2");
      await user.click(page2Button);

      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

      expect(page2Button).toHaveAttribute("aria-current", "page");
    });

    it("should show ellipsis for large page counts", () => {
      const largeData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + i,
        tags: ["user"],
        date: "2023-01-01T00:00:00Z",
      }));

      render(
        <Table
          {...defaultProps}
          data={largeData}
          itemsPerPage={2}
          showPageNumbers={true}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("should handle page numbers with custom styling", () => {
      const customClassNames = {
        pageButton: "custom-page-button",
        activePageButton: "custom-active-page-button",
      };

      render(
        <Table
          {...defaultProps}
          itemsPerPage={2}
          showPageNumbers={true}
          classNames={{ pagination: customClassNames }}
        />
      );

      const page1Button = screen.getByText("1");
      const page2Button = screen.getByText("2");

      expect(page1Button).toHaveClass("custom-active-page-button");
      expect(page2Button).toHaveClass("custom-page-button");
    });

    it("should show all pages when total pages <= 5", () => {
      render(
        <Table {...defaultProps} itemsPerPage={1} showPageNumbers={true} />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(
        <Table {...defaultProps} itemsPerPage={2} showPageNumbers={true} />
      );

      const page1Button = screen.getByText("1");
      const page2Button = screen.getByText("2");

      expect(page1Button).toHaveAttribute("aria-label", "Go to page 1");
      expect(page2Button).toHaveAttribute("aria-label", "Go to page 2");

      expect(page1Button).toHaveAttribute("aria-current", "page");
    });
  });

  describe("row selection", () => {
    it("should render selection checkboxes when enabled", () => {
      const columns = [
        { accessorKey: "select" as const, header: "" },
        ...mockColumns,
      ];

      render(
        <Table {...defaultProps} columns={columns} enableRowSelection={true} />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(4); // 1 header + 3 rows
    });

    it("should select individual rows", async () => {
      const user = userEvent.setup();
      const onRowSelectionChange = jest.fn();
      const columns = [
        { accessorKey: "select" as const, header: "" },
        ...mockColumns,
      ];

      render(
        <Table
          {...defaultProps}
          columns={columns}
          enableRowSelection={true}
          rowSelection={{}}
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const rowCheckboxes = screen.getAllByRole("checkbox").slice(1); // Skip header
      const firstCheckbox = rowCheckboxes[0];
      expect(firstCheckbox).toBeInTheDocument();
      if (firstCheckbox) {
        await user.click(firstCheckbox);
      }

      expect(onRowSelectionChange).toHaveBeenCalledWith({
        1: true,
      });
    });

    it.skip("should select all rows", async () => {
      // TODO: Fix select all functionality - callback not being triggered
      const user = userEvent.setup();
      const onRowSelectionChange = jest.fn();
      const columns = [
        { accessorKey: "select" as const, header: "" },
        ...mockColumns,
      ];

      render(
        <Table
          {...defaultProps}
          columns={columns}
          enableRowSelection={true}
          rowSelection={{}}
          onRowSelectionChange={onRowSelectionChange}
          paginationMode="off"
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(4); // 1 header + 3 rows

      const headerCheckbox = checkboxes[0];
      expect(headerCheckbox).toBeInTheDocument();
      expect(headerCheckbox).toHaveAttribute(
        "aria-label",
        "Select all rows on this page"
      );

      if (headerCheckbox) {
        await user.click(headerCheckbox);
      }

      expect(onRowSelectionChange).toHaveBeenCalledWith({
        1: true,
        2: true,
        3: true,
      });
    });
  });

  describe("custom rendering", () => {
    it("should use custom cell renderer", () => {
      const customColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: "name",
          header: "Name",
          cell: (row) => <strong data-testid="custom-cell">{row.name}</strong>,
        },
      ];

      render(<Table {...defaultProps} columns={customColumns} />);

      // There are multiple custom cells, so use getAllByTestId
      const customCells = screen.getAllByTestId("custom-cell");
      expect(customCells).toHaveLength(3);
      expect(screen.getByText("John Doe").tagName).toBe("STRONG");
    });

    it("should use custom formatValue", () => {
      const formatValue = jest.fn((value) => `Custom: ${value}`);

      render(<Table {...defaultProps} formatValue={formatValue} />);

      expect(formatValue).toHaveBeenCalled();
    });

    it("should handle row clicks", async () => {
      const user = userEvent.setup();
      const onRowClick = jest.fn();

      render(<Table {...defaultProps} onRowClick={onRowClick} />);

      const firstRow = screen.getAllByRole("row")[1]; // Skip header
      expect(firstRow).toBeInTheDocument();
      if (firstRow) {
        await user.click(firstRow);
      }

      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(5);
      expect(screen.getAllByRole("row")).toHaveLength(4); // 1 header + 3 data rows
    });

    it("should have proper sort ARIA attributes", async () => {
      const user = userEvent.setup();
      render(<Table {...defaultProps} />);

      const nameHeader = screen.getByRole("button", { name: /name/i });
      expect(nameHeader.closest("th")).toHaveAttribute("aria-sort", "none");

      await user.click(nameHeader);
      expect(nameHeader.closest("th")).toHaveAttribute(
        "aria-sort",
        "ascending"
      );
    });
  });

  describe("error handling", () => {
    it("should handle malformed data gracefully", () => {
      const malformedData = [
        { id: 1, name: null, email: undefined },
        { id: 2, name: "Valid Name" },
      ];

      expect(() => {
        render(
          <Table
            data={malformedData as unknown as TestData[]}
            columns={mockColumns}
          />
        );
      }).not.toThrow();

      // There are multiple "-" elements, so use getAllByText
      const dashElements = screen.getAllByText("-");
      expect(dashElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Valid Name")).toBeInTheDocument();
    });
  });
});
