declare module '@testing-library/user-event' {
  const userEvent: {
    setup: () => {
      type: (element: HTMLElement, text: string) => Promise<void>,
      click: (element: HTMLElement) => Promise<void>,
      clear: (element: HTMLElement) => Promise<void>,
      selectOptions: (element: HTMLElement, values: string[]) => Promise<void>,
    }
  };
  export default userEvent;
}
