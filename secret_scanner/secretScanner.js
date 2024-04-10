const { all } = require("axios");
const api = require("../api/apiClient");

const getAllSecretsWithLocations = async (
  postmanApiKey,
  workspaceId,
  maxSecretsToReturn,
) => {
  const allSecrets = await api.getAllUnresolvedSecrets(
    postmanApiKey,
    workspaceId,
  );
  const totalSecrets = allSecrets.length;
  allSecrets.splice(maxSecretsToReturn);
  const allSecretWithLocations = [];
  for (const secret of allSecrets) {
    const locations = await api.getAllSecretLocations(
      postmanApiKey,
      secret.secretId,
      workspaceId,
    );
    allSecretWithLocations.push({
      secretId: secret.secretId,
      secretType: secret.secretType,
      detectedAt: secret.detectedAt,
      locations: locations,
    });
  }
  return { totalSecrets, secretsList: allSecretWithLocations };
};

const resolveMultipleSecrets = async (postmanApiKey, workspaceId, secretIds, status) => {
  const resolutions = [];
  for (const secretId of secretIds) {
    const resolution = await api.resolveSecret(postmanApiKey, secretId, workspaceId, status);
    resolutions.push(resolution);
  }
  return resolutions;
}

module.exports = {
  getAllSecretsWithLocations,
  resolveMultipleSecrets,
};
