export default {
  testEnvironment: "node",
  transformIgnorePatterns: [
    "/node_modules/(?!(hasch)/)"
  ],
  coveragePathIgnorePatterns: [
    "/backend/lib/pkd"
  ],
  testPathIgnorePatterns: ["/node_modules/", "\\.js$"]
};
