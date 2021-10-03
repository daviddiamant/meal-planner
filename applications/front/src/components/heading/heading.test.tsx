import { render } from "../../utils";
import { Heading } from ".";

describe("Components/Heading", () => {
  it("Should default to h1", () => {
    const { getByRole } = render(<Heading>Test</Heading>);
    const heading = getByRole("heading");

    expect(heading.tagName).toBe("H1");
  });

  it.each(["h2", "h3"] as ("h2" | "h3")[])(
    "Should display other heading levels",
    (tagName) => {
      const { getByRole } = render(<Heading as={tagName}>Test</Heading>);
      const heading = getByRole("heading");

      expect(heading.tagName).toBe(tagName.toUpperCase());
    }
  );
});
