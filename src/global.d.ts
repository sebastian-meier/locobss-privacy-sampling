export {}

declare global {
  const __global: {
    env: {
      ENVVAR: string;
    }
  };
}
