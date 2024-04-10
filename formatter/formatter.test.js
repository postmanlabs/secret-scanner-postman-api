const { formatSecretsTable } = require("./formatter");
const chalkTable = require("chalk-table");

describe("formatSecretsTable", () => {
  it("should format secrets table correctly", () => {
    const secretsWithLocations = [
      {
        secretId: "1",
        secretType: "KEY",
        locations: [
          { resourceType: "request", occurrences: 1, isResourceDeleted: false },
          { resourceType: "example", occurrences: 0, isResourceDeleted: true },
        ],
      },
      {
        secretId: "2",
        secretType: "PASSWORD",
        locations: [
          { resourceType: "example", occurrences: 2, isResourceDeleted: false },
        ],
      },
    ];

    const formattedTable = formatSecretsTable(secretsWithLocations);

    expect(formattedTable.split("\n").length).toBe(7);
  });
});
