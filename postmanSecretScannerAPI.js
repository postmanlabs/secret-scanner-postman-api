#!/usr/bin/env node

const {
  getAllSecretsWithLocations,
  resolveMultipleSecrets,
} = require("./secret_scanner/secretScanner");
const { formatSecretsTable } = require("./formatter/formatter");

//get the api key from the environment variables
const apiKey = process.env.POSTMAN_API_KEY;
if (!apiKey) {
  console.error("Please set the POSTMAN_API_KEY environment variable");
  process.exit(1);
}

//get the workspace id from the command line
const args = require("yargs").argv;
const workspaceId = args.workspaceId;
const operation = args.operation;
const secretIds = args.secretIds;
const status = args.status;
const limit = args.limit || 10;

if (
  !workspaceId ||
  !operation ||
  (operation === "resolve" && (!secretIds || !status))
) {
  console.error(
    "Usage: ./postmanSecretScannerAPI.js --workspace <workspaceId> --operation <operation> [--secretIds <secretIds>] [--status <status>] [--limit <limit=10>]",
  );
  console.error(
    "workspaceId: the workspace in which we want to manage secrets. Mandatory.",
  );
  console.error(
    "operation: type of operation we want to perform. It can be 'list' or 'resolve'. For resolve operation, secretIds and status are mandatory.",
  );
  console.error(
    "secretIds: comma separated list of secretIds to resolve. Mandatory for resolve operation.",
  );
  console.error(
    "status: status to set for the secrets. It can be 'FALSE_POSITIVE', 'REVOKED', or 'ACCEPTED_RISK'. Mandatory for resolve operation.",
  );
  console.error(
    "limit: maximum number of secrets to list in the table. Notice each secret can be in several locations. For each secret displayed, at least an additional API request is done. Default is 10. Optional.",
  );
  process.exit(1);
}

const mainProcess = async () => {
  if (operation === "list") {
    const { totalSecrets, secretsList } = await getAllSecretsWithLocations(
      apiKey,
      workspaceId,
      limit,
    );
    console.log(`Total secrets unresolved in workspace: ${totalSecrets}`);
    console.log(`Showing a table of the first ${limit} secrets`);
    console.log(formatSecretsTable(secretsList));
  } else if (operation === "resolve") {
    const resolutions = await resolveMultipleSecrets(
      apiKey,
      workspaceId,
      secretIds.split(","),
      status,
    );
    console.log(`Secrets resolved: ${resolutions.length}`);
  }
};

mainProcess().catch((error) => {
  console.error(error);
  process.exit(1);
});
