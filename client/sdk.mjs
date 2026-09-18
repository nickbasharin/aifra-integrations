// packages/sdk/src/index.ts
var SDK_CLIENT_NAME = "ai-deploy-sdk";
var SDK_CLIENT_VERSION = "0.1.0-stage2";
var PreviewApiError = class extends Error {
  code;
  details;
  statusCode;
  constructor(statusCode, payload) {
    super(payload.message);
    this.name = "PreviewApiError";
    this.code = payload.code;
    this.details = payload.details;
    this.statusCode = statusCode;
  }
};
function normalizeOrigin(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("API origin must be an HTTP(S) origin without credentials");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("API origin must not include a path, query or fragment");
  }
  return url.origin;
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function parseApiError(statusCode, value) {
  const error = isRecord(value) && isRecord(value.error) ? value.error : void 0;
  return new PreviewApiError(statusCode, {
    code: typeof error?.code === "string" ? error.code : "unexpected_api_error",
    message: typeof error?.message === "string" ? error.message : `Preview API request failed with HTTP ${statusCode}`,
    ...isRecord(error?.details) ? { details: error.details } : {}
  });
}
async function responseJson(response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return void 0;
  try {
    return await response.json();
  } catch {
    return void 0;
  }
}
function assertPreviewResult(value, includeToken) {
  if (!isRecord(value) || typeof value.preview_id !== "string" || typeof value.url !== "string" || typeof value.expires_at !== "string" || value.status !== "ready" || includeToken && typeof value.manage_token !== "string") {
    throw new Error("Preview API returned an invalid success response");
  }
}
var PreviewApiClient = class {
  apiOrigin;
  fetchImplementation;
  metadata;
  constructor(options) {
    this.apiOrigin = normalizeOrigin(options.apiOrigin);
    this.fetchImplementation = options.fetchImplementation ?? fetch;
    this.metadata = {
      anonymousId: options.anonymousId,
      clientName: options.clientName ?? SDK_CLIENT_NAME,
      clientVersion: options.clientVersion ?? SDK_CLIENT_VERSION,
      source: options.source ?? "unknown"
    };
  }
  async createPreview(archive) {
    const response = await this.request("/v1/previews", {
      body: archive,
      headers: this.deploymentHeaders(),
      method: "POST"
    });
    const body = await this.successJson(response);
    assertPreviewResult(body, true);
    return body;
  }
  async updatePreview(previewId, managementToken, archive) {
    const response = await this.request(
      `/v1/previews/${encodeURIComponent(previewId)}`,
      {
        body: archive,
        headers: {
          ...this.deploymentHeaders(),
          authorization: `Bearer ${managementToken}`
        },
        method: "PUT"
      }
    );
    const body = await this.successJson(response);
    assertPreviewResult(body, false);
    return body;
  }
  async deletePreview(previewId, managementToken) {
    const response = await this.request(
      `/v1/previews/${encodeURIComponent(previewId)}`,
      {
        headers: { authorization: `Bearer ${managementToken}` },
        method: "DELETE"
      }
    );
    if (response.status !== 204) {
      throw new Error(`Preview API returned HTTP ${response.status} instead of 204`);
    }
  }
  async getPreview(previewId) {
    const response = await this.request(
      `/v1/previews/${encodeURIComponent(previewId)}`,
      {
        method: "GET"
      }
    );
    const body = await this.successJson(response);
    assertPreviewResult(body, false);
    return body;
  }
  deploymentHeaders() {
    return {
      "content-type": "application/zip",
      "x-ai-deploy-accept-terms": "true",
      "x-ai-deploy-anonymous-id": this.metadata.anonymousId,
      "x-ai-deploy-client-name": this.metadata.clientName,
      "x-ai-deploy-client-version": this.metadata.clientVersion,
      "x-ai-deploy-source": this.metadata.source
    };
  }
  async request(pathname, init) {
    const response = await this.fetchImplementation(
      `${this.apiOrigin}${pathname}`,
      init
    );
    if (!response.ok) {
      throw parseApiError(response.status, await responseJson(response));
    }
    return response;
  }
  async successJson(response) {
    const body = await responseJson(response);
    if (body === void 0) {
      throw new Error("Preview API returned a non-JSON success response");
    }
    return body;
  }
};
export {
  PreviewApiClient,
  PreviewApiError,
  SDK_CLIENT_NAME,
  SDK_CLIENT_VERSION
};
