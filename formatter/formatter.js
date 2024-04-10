const terminalLink = require("terminal-link");
const chalkTable = require("chalk-table");

const formatSecretsTable = (secretsWithLocations) => {
  const tableOptions = {
    leftPad: 2,
    columns: [
      { field: "secretId", name: "Secret ID" },
      { field: "secretType", name: "Secret Type" },
      { field: "resourceType", name: "Location" },
      { field: "occurrences", name: "Occurrences" },
      { field: "isResourceDeleted", name: "Resource Deleted" },
    ],
  };
  const tableData = secretsWithLocations
    .map((secret) => {
      return secret.locations.map((location) => {
        return {
          secretId: secret.secretId,
          secretType: secret.secretType,
          resourceType: terminalLink(location.resourceType, location.url),
          occurrences: location.occurrences,
          isResourceDeleted: location.isResourceDeleted,
        };
      });
    })
    .flat();
  return chalkTable(tableOptions, tableData);
};

module.exports = {
  formatSecretsTable,
};
