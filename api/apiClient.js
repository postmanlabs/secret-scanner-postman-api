const axios = require("axios");
const { POSTMAN_API_BASE_URL, PAGINATION_SIZE } = require("./constants");
const { getAxiosConfig } = require("./axiosUtils");

const getAllUnresolvedSecrets = async (postmanApiKey, workspaceId) => {
  const secretList = [];
  let nextCursor = null;
  do {
    let url = `${POSTMAN_API_BASE_URL}/detected-secrets-queries?limit=${PAGINATION_SIZE}${
      nextCursor ? `&cursor=${nextCursor}` : ""
    }`;
    const response = await axios.post(
      url,
      {
        resolved: false,
        workspaceIds: [workspaceId],
      },
      getAxiosConfig(postmanApiKey),
    );
    nextCursor = response.data.meta.nextCursor;
    secretList.push(...response.data.data);
  } while (nextCursor);
  return secretList;
};

const getAllSecretLocations = async (postmanApiKey, secretId, workspaceId) => {
  const locationList = [];
  let nextCursor = null;
  do {
    let url = `${POSTMAN_API_BASE_URL}/detected-secrets/${secretId}/locations?workspaceId=${workspaceId}&limit=${PAGINATION_SIZE}${
      nextCursor ? `&cursor=${nextCursor}` : ""
    }`;
    const response = await axios.get(url, getAxiosConfig(postmanApiKey));
    nextCursor = response.data.meta.nextCursor;
    locationList.push(...response.data.data);
  } while (nextCursor);
  return locationList;
};

const resolveSecret = async (
  postmanApiKey,
  secretId,
  workspaceId,
  resolution,
) => {
  const url = `${POSTMAN_API_BASE_URL}/detected-secrets/${secretId}`;
  const response = await axios.put(
    url,
    {
      resolution,
      workspaceId,
    },
    getAxiosConfig(postmanApiKey),
  );
  return response.data;
};

module.exports = {
  getAllUnresolvedSecrets,
  getAllSecretLocations,
  resolveSecret,
};
