import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ChipDisplay from "../../src/components/ChipDisplay";

describe("ChipDisplay", () => {
  const mockItems = ["tag1", "tag2", "tag3", "tag4", "tag5"];

  it("should render all items when count is small", () => {
    render(<ChipDisplay items={["tag1", "tag2"]} />);

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("should show limited items with more button", () => {
    render(<ChipDisplay items={mockItems} maxVisibleItems={3} />);

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByText("tag3")).toBeInTheDocument();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
    expect(screen.queryByText("tag4")).not.toBeInTheDocument();
  });

  it("should expand to show all items when clicking more button", async () => {
    const user = userEvent.setup();
    render(<ChipDisplay items={mockItems} maxVisibleItems={3} />);

    const moreButton = screen.getByText("+2 more");
    await user.click(moreButton);

    expect(screen.getByText("tag4")).toBeInTheDocument();
    expect(screen.getByText("tag5")).toBeInTheDocument();
    expect(screen.queryByText("+2 more")).not.toBeInTheDocument();
  });

  it("should collapse when clicking show less", async () => {
    const user = userEvent.setup();
    render(<ChipDisplay items={mockItems} maxVisibleItems={3} />);

    // Expand first
    const moreButton = screen.getByText("+2 more");
    await user.click(moreButton);

    // Then collapse
    const lessButton = screen.getByText("Show less");
    await user.click(lessButton);

    expect(screen.queryByText("tag4")).not.toBeInTheDocument();
    expect(screen.queryByText("tag5")).not.toBeInTheDocument();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("should handle empty items array", () => {
    render(<ChipDisplay items={[]} />);

    expect(screen.getByTestId("chip-display-container")).toBeEmptyDOMElement();
  });

  it("should apply custom class names", () => {
    const classNames = {
      container: "custom-container",
      chip: "custom-chip",
      moreButton: "custom-more-button",
    };

    render(
      <ChipDisplay
        items={mockItems}
        maxVisibleItems={2}
        classNames={classNames}
      />
    );

    expect(screen.getByTestId("chip-display-container")).toHaveClass(
      "custom-container"
    );
    expect(screen.getByText("tag1")).toHaveClass("custom-chip");
    expect(screen.getByText("+3 more")).toHaveClass("custom-more-button");
  });

  it("should handle single item", () => {
    render(<ChipDisplay items={["single"]} />);

    expect(screen.getByText("single")).toBeInTheDocument();
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it("should not show more button when maxVisibleItems exceeds item count", () => {
    render(<ChipDisplay items={["tag1", "tag2"]} maxVisibleItems={5} />);

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it("should handle maxVisibleItems of 0", () => {
    render(<ChipDisplay items={mockItems} maxVisibleItems={0} />);

    expect(screen.queryByText("tag1")).not.toBeInTheDocument();
    expect(screen.getByText("+5 more")).toBeInTheDocument();
  });

  it("should sanitize item content", () => {
    const maliciousItems = ["<script>alert('xss')</script>", "normal tag"];
    render(<ChipDisplay items={maliciousItems} />);

    expect(
      screen.getByText((content) =>
        content.includes("<script>alert('xss')</script>")
      )
    ).toBeInTheDocument();
    expect(screen.getByText("normal tag")).toBeInTheDocument();
  });
});
