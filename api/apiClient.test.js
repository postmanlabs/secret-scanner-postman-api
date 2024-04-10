const axios = require("axios");
const { getAxiosConfig } = require("./axiosUtils");
const { POSTMAN_API_BASE_URL, PAGINATION_SIZE } = require("./constants");
const apiClient = require("./apiClient");

jest.mock("axios");
jest.mock("./axiosUtils", () => {
  return {
    getAxiosConfig: jest.fn().mockReturnValue({}),
  };
});
const axiosPost = axios.post;
const axiosGet = axios.get;
const axiosPut = axios.put;

describe("test getAllUnresolvedSecretsForWorkspace", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("calls the Postman API with the proper URL and paginates", async () => {
    axiosPost.mockResolvedValueOnce({
      status: 200,
      data: {
        meta: { nextCursor: "1" },
        data: [{ secretId: "1" }, { secretId: "2" }],
      },
    });
    axiosPost.mockResolvedValueOnce({
      status: 200,
      data: { meta: { nextCursor: null }, data: [{ secretId: "3" }] },
    });
    const apiKey = "API_KEY";
    const workspaceId = "WORKSPACE_ID";
    const result = await apiClient.getAllUnresolvedSecrets(apiKey, workspaceId);
    expect(result).toEqual([
      { secretId: "1" },
      { secretId: "2" },
      { secretId: "3" },
    ]);
    expect(getAxiosConfig).toHaveBeenCalledTimes(2);
    expect(getAxiosConfig).toHaveBeenCalledWith(apiKey);
    expect(axiosPost).toHaveBeenCalledTimes(2);
    expect(axiosPost).toHaveBeenCalledWith(
      `${POSTMAN_API_BASE_URL}/detected-secrets-queries?limit=${PAGINATION_SIZE}`,
      {
        resolved: false,
        workspaceIds: [workspaceId],
      },
      {},
    );
    expect(axiosPost).toHaveBeenLastCalledWith(
      `${POSTMAN_API_BASE_URL}/detected-secrets-queries?limit=${PAGINATION_SIZE}&cursor=1`,
      {
        resolved: false,
        workspaceIds: [workspaceId],
      },
      {},
    );
  });
});

describe("test getAllSecretLocations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("calls the Postman API with the proper URL and paginates", async () => {
    axiosGet.mockResolvedValueOnce({
      status: 200,
      data: {
        meta: { nextCursor: "1" },
        data: [{ locationId: "1" }, { locationId: "2" }],
      },
    });
    axiosGet.mockResolvedValueOnce({
      status: 200,
      data: { meta: { nextCursor: null }, data: [{ locationId: "3" }] },
    });
    const apiKey = "API_KEY";
    const secretId = "SECRET_ID";
    const workspaceId = "WORKSPACE_ID";
    const result = await apiClient.getAllSecretLocations(
      apiKey,
      secretId,
      workspaceId,
    );
    expect(result).toEqual([
      { locationId: "1" },
      { locationId: "2" },
      { locationId: "3" },
    ]);
    expect(getAxiosConfig).toHaveBeenCalledTimes(2);
    expect(getAxiosConfig).toHaveBeenCalledWith(apiKey);
    expect(axiosGet).toHaveBeenCalledTimes(2);
    expect(axiosGet).toHaveBeenCalledWith(
      `${POSTMAN_API_BASE_URL}/detected-secrets/${secretId}/locations?workspaceId=${workspaceId}&limit=${PAGINATION_SIZE}`,
      {},
    );
    expect(axiosGet).toHaveBeenLastCalledWith(
      `${POSTMAN_API_BASE_URL}/detected-secrets/${secretId}/locations?workspaceId=${workspaceId}&limit=${PAGINATION_SIZE}&cursor=1`,
      {},
    );
  });
});

describe("test resolveSecret", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("calls the Postman API with the proper URL and payload", async () => {
    axiosPut.mockResolvedValueOnce({
      status: 200,
      data: { secretId: "SECRET_ID" },
    });
    const apiKey = "API_KEY";
    const secretId = "SECRET_ID";
    const workspaceId = "WORKSPACE_ID";
    const resolution = "ACCEPTED_RISK";
    const result = await apiClient.resolveSecret(
      apiKey,
      secretId,
      workspaceId,
      resolution,
    );
    expect(result).toEqual({ secretId: "SECRET_ID" });
    expect(getAxiosConfig).toHaveBeenCalledTimes(1);
    expect(getAxiosConfig).toHaveBeenCalledWith(apiKey);
    expect(axiosPut).toHaveBeenCalledTimes(1);
    expect(axiosPut).toHaveBeenCalledWith(
      `${POSTMAN_API_BASE_URL}/detected-secrets/${secretId}`,
      { resolution, workspaceId },
      {},
    );
  });
});
