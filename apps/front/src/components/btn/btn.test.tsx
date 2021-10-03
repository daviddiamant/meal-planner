import { fireEvent, render } from "../../utils";
import { Btn } from ".";

describe("Components/Btn", () => {
  it("Should display the text", () => {
    const { getByRole } = render(<Btn>Test</Btn>);
    const button = getByRole("button");

    expect(button).toHaveTextContent("Test");
  });

  it("Should trigger onClick when enabled", () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Btn onClick={onClick}>Test</Btn>);
    const button = getByRole("button");

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("Should not trigger onClick when disabled", () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Btn onClick={onClick} disabled>
        Test
      </Btn>
    );
    const button = getByRole("button");

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
