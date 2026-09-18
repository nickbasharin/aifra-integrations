
export declare const SDK_CLIENT_NAME: "ai-deploy-sdk";
export declare const SDK_CLIENT_VERSION: "0.1.0-stage2";
export interface PreviewResult {
    readonly active_slots_for_ip: number;
    readonly active_slots_limit: number;
    readonly expires_at: string;
    readonly preview_id: string;
    readonly status: 'ready';
    readonly ttl_seconds: number;
    readonly url: string;
}
export interface CreatePreviewResult extends PreviewResult {
    readonly manage_token: string;
}
export interface PreviewStatusResult {
    readonly bytes: number;
    readonly expires_at: string;
    readonly files_count: number;
    readonly preview_id: string;
    readonly status: 'ready';
    readonly ttl_seconds: number;
    readonly updates_count: number;
    readonly url: string;
}
export interface ApiErrorPayload {
    readonly error: {
        readonly code: string;
        readonly details?: ErrorDetails;
        readonly message: string;
    };
}
export declare class PreviewApiError extends Error {
    readonly code: string;
    readonly details: ErrorDetails | undefined;
    readonly statusCode: number;
    constructor(statusCode: number, payload: ApiErrorPayload['error']);
}
export interface PreviewApiClientOptions {
    readonly anonymousId: string;
    readonly apiOrigin: string;
    readonly clientName?: string;
    readonly clientVersion?: string;
    readonly fetchImplementation?: typeof fetch;
    readonly source?: DeploymentSource;
}
export declare class PreviewApiClient {
    private readonly apiOrigin;
    private readonly fetchImplementation;
    private readonly metadata;
    constructor(options: PreviewApiClientOptions);
    createPreview(archive: Uint8Array): Promise<CreatePreviewResult>;
    updatePreview(previewId: string, managementToken: string, archive: Uint8Array): Promise<PreviewResult>;
    deletePreview(previewId: string, managementToken: string): Promise<void>;
    getPreview(previewId: string): Promise<PreviewStatusResult>;
    private deploymentHeaders;
    private request;
    private successJson;
}

export type PreviewStatus = 'active' | 'deleted' | 'expired';
declare const DEPLOYMENT_SOURCES: readonly ["codex", "chatgpt", "claude-code", "cursor", "github", "mcp-registry", "yandex-organic", "google-organic", "telegram", "habr", "vc", "direct", "unknown"];
export type DeploymentSource = (typeof DEPLOYMENT_SOURCES)[number];
export interface ClientMetadata {
    readonly anonymousId: string;
    readonly clientName: string;
    readonly clientVersion: string;
    readonly source: DeploymentSource;
}

export interface ErrorDetails {
    readonly [key: string]: boolean | number | string | null;
}