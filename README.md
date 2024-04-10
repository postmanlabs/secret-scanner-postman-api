# secret-scanner-postman-api

> This code is part of a blog post and is **not** actively maintained by Postman.

Command line utility to manage Postman secret scanner entries using the Postman API.

## Purpose

This code demonstrates how to use the [Postman API](https://www.postman.com/postman/workspace/postman-public-workspace/collection/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a) to list and resolve exposed secrets in a specific workspace.

The goal of this repository is to demonstrate how the [Secret Scanner](https://www.postman.com/postman/workspace/postman-public-workspace/folder/12959542-129b53d2-77f7-4593-89d5-a5a600e9d80f) endpoints can be used to list the exposed secrets in a workspace, and optionally resolve them in batches, instead of having to use the UI and manually resolve each exposed secret.

In order to do this, we have created a [small Postman API wrapper](api/apiClient.js) that enables users to list and resolve secrets in a workspace. We have also created a Javascript file called [postmanSecretScannerAPI.js](postmanSecretScannerAPI.js) that can be executed as a shell script.

> NOTE: You need a valid [Postman API key](https://learning.postman.com/docs/developer/postman-api/authentication/) saved in an environment variable called `POSTMAN_API_KEY` to execute the command.

```shell
export POSTMAN_API_KEY=PMAK_your_key
```

## Usage

The (postmanSecretScannerAPI.js)[postmanSecretScannerAPI.js] command receives the following arguments:

```shell
./postmanSecretScannerAPI.js --workspace <workspaceId> --operation <operation> [--secretIds <secretIds>] [--status <status>] [--limit <limit=10>]
```

| Argument    | Description                                                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| workspaceId | the workspace ID you want to manage secrets.                                                                                                                                                    |
| operation   | type of operation we want to perform. It can be 'list' or 'resolve'. For resolve operation, secretIds and status are mandatory.                                                                 |
| secretIds   | comma separated list of secretIds to resolve. Mandatory for resolve operation.                                                                                                                  |
| status      | status to set for the secrets. It can be 'FALSE_POSITIVE', 'REVOKED', or 'ACCEPTED_RISK'. Mandatory for resolve operation.                                                                      |
| limit       | maximum number of secrets to list in the table. Notice each secret can be in several locations. For each secret displayed, at least an additional API request is done. Default is 10. Optional. |

# Example of a list operation

```shell
./postmanSecretScannerAPI.js --workspaceId 51679e9a-b94f-4ac1-b1c1-7a8d035436cf --operation list --limit 5
```

This is the output of the command:

```shell
Total secrets unresolved in workspace: 11
Showing a table of the first 5 secrets
  +--------------+------------------------+----------+-------------+------------------+
  | Secret ID    | Secret Type            | Location | Occurrences | Resource Deleted |
  +--------------+------------------------+----------+-------------+------------------+
  | NjYyMjcyNw== | Authorization Password | request  | 1           | false            |
  | NjYyMjcyNw== | Authorization Password | request  | 1           | false            |
  | NjcxNTY2Ng== | Authorization Secret   | request  | 0           | true             |
  | ODIzNTkzMw== | Postman API Key        | request  | 1           | false            |
  | ODIzNTkzMw== | Postman API Key        | request  | 0           | false            |
  | NjYyMzU4OA== | Postman Collection Key | example  | 0           | true             |
  | NjYyMzU4OA== | Postman Collection Key | example  | 0           | true             |
  | NjYxMDk1Mg== | AWS Access Key         | request  | 0           | false            |
  | NjYxMDk1Mg== | AWS Access Key         | request  | 1           | false            |
  +--------------+------------------------+----------+-------------+------------------+
```

The `location` column values are links to the Postman resource (request, example, API...) that contains the secret, so you can check it.

Notice for each secret, additional API requests are performed to retrieve the locations. Take into account this, as the Postman API has rate and usage limits.

# Example of resolve operation

```shell
./postmanSecretScannerAPI.js --workspaceId 51679e9a-b94f-4ac1-b1c1-7a8d035436cf --operation resolve --secretIds NjcxNTY2Ng==,NjYyMzU4OA== --status ACCEPTED_RISK
```

This is the output of the command:

```shell
Secrets resolved: 2
```

An API call is performed for each secret ID passed in the `secretIds` list argument.
