export {};
module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    "!src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!**/vendor/**",
  ],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_CLIENT_ID: "*",
                    VITE_CLIENT_SECRET: "*",
                    VITE_BASE_URL_API: "*",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "setupTests.ts",
    "index.tsx",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/assetsTransformer.ts",
    "\\.(css|less)$": "<rootDir>/assetsTransformer.ts",
  },
};
