const secretScanner = require("./secretScanner");
const api = require("../api/apiClient");

describe("secretScanner", () => {
  describe("getAllSecretsWithLocations", () => {
    it("should call the apiClient to get all secrets with locations", async () => {
      const workspaceId = "workspace123";
      const secret1 = {
        secretId: "secret1",
        secretType: "type1",
        detectedAt: "2023-03-20T12:34:00.000Z",
      };
      const secret2 = {
        secretId: "secret2",
        secretType: "type2",
        detectedAt: "2023-03-20T12:34:00.000Z",
      };
      const secret1Locations = [
        { isResourceDeleted: false, occurrences: 1, url: "url1" },
      ];
      const secret2Locations = [
        { isResourceDeleted: true, occurrences: 2, url: "url2" },
        { isResourceDeleted: false, occurrences: 3, url: "url3" },
      ];
      const expectedResponse = [
        { ...secret1, locations: secret1Locations },
        { ...secret2, locations: secret2Locations },
      ];

      api.getAllUnresolvedSecrets = jest
        .fn()
        .mockResolvedValue([secret1, secret2]);
      api.getAllSecretLocations = jest
        .fn()
        .mockResolvedValueOnce(secret1Locations)
        .mockResolvedValueOnce(secret2Locations);

      const apiKey = "API_KEY";
      const { totalSecrets, secretsList } =
        await secretScanner.getAllSecretsWithLocations(apiKey, workspaceId, 10);

      expect(api.getAllUnresolvedSecrets).toHaveBeenCalledWith(
        apiKey,
        workspaceId,
      );
      expect(api.getAllSecretLocations).toHaveBeenCalledWith(
        apiKey,
        secret1.secretId,
        workspaceId,
      );
      expect(api.getAllSecretLocations).toHaveBeenCalledWith(
        apiKey,
        secret2.secretId,
        workspaceId,
      );
      expect(secretsList).toEqual(expectedResponse);
      expect(totalSecrets).toEqual(2);
    });
  });
});
