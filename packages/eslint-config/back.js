module.exports = {
  extends: ["./base"],
  env: {
    node: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
};
