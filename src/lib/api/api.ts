/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /** @example "user@example.com" */
  email: string;
  /** @example "password123" */
  password: string;
  /** @example "John Doe" */
  name: string;
  /** @example "ptik" */
  major: string;
}

export interface RegisterResponseDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "John Doe" */
  name: string;
  /** @example "ptik" */
  major: string;
  /** @example "STUDENT" */
  role: "STUDENT" | "TEACHER" | "ADMIN";
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  updatedAt: string;
}

export interface LoginDto {
  /** @example "user@example.com" */
  email: string;
  /** @example "password123" */
  password: string;
}

export interface UserDataDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "John Doe" */
  name: string;
  /** @example "STUDENT" */
  role: "STUDENT" | "TEACHER" | "ADMIN";
  /** @example "ptik" */
  major: string;
}

export interface AuthResponseDto {
  /**
   * JWT authentication token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOiJhMWIyYzNkNC1lNWY2LTc4OTAtYWJjZC1lZjEyMzQ1Njc4OTAiLCJyb2xlIjoiU1RVREVOVCIsIm1ham9yIjoicHRpayIsImlhdCI6MTY4MDAwMDAwMCwiZXhwIjoxNjgwMDg2NDAwfQ.example_signature_here"
   */
  access_token: string;
  user: UserDataDto;
}

export interface UserResponseDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "John Doe" */
  name: string;
  /** @example "ptik" */
  major: string;
  /** @example "STUDENT" */
  role: "STUDENT" | "TEACHER" | "ADMIN";
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  updatedAt: string;
}

export interface UpdateRoleDto {
  /** New role for user */
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

export interface UpdateUserDto {
  /** @example "john@example.com" */
  email?: string;
  /** @example "password123" */
  password: string;
  /** @example "John Doe" */
  name: string;
  /** @example "ptik" */
  major: string;
}

export interface UploadResponseDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "doc_1234567890.pdf" */
  filename: string;
  /**
   * Current processing status of the document
   * @example "PROCESSING"
   */
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  /**
   * Status message
   * @example "Document uploaded successfully. Processing in background."
   */
  message: string;
}

export interface UpdateVisibilityDto {
  /** New visibility setting */
  visibility: "PUBLIC" | "PRIVATE";
}

export interface DocumentResponseDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  userId: string;
  /** @example "doc_1234567890.pdf" */
  filename: string;
  /** @example "my-document.pdf" */
  originalName: string;
  /**
   * File size in bytes
   * @example 1024000
   */
  fileSize: number;
  /**
   * MIME type
   * @example "application/pdf"
   */
  mimeType: string;
  /**
   * Processing status
   * @example "COMPLETED"
   */
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  /**
   * Total number of chunks
   * @example 15
   */
  totalChunks: number;
  /**
   * Document visibility
   * @example "PRIVATE"
   */
  visibility: "PUBLIC" | "PRIVATE";
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  updatedAt: string;
}

export interface QueryDocumentDto {
  /**
   * Search query text
   * @minLength 3
   * @maxLength 500
   * @example "What is machine learning?"
   */
  query: string;
  /**
   * Number of top similar results to return
   * @min 1
   * @max 10
   * @default 5
   * @example 5
   */
  topK?: number;
  /**
   * Optional array of document IDs to filter search
   * @example ["a1b2c3d4-e5f6-7890-abcd-ef1234567890","b2c3d4e5-f6a7-8901-bcde-f12345678901"]
   */
  documentIds?: string[];
}

export interface QuerySourceDto {
  /**
   * Document ID
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  documentId: string;
  /**
   * Document name
   * @example "my-document.pdf"
   */
  documentName: string;
  /**
   * Chunk index in the document
   * @example 0
   */
  chunkIndex: number;
  /**
   * Similarity score (0-1)
   * @example 0.8523
   */
  similarity: number;
  /**
   * Text content from the chunk (truncated to 200 characters)
   * @example "This is the text content from the chunk. It contains relevant information about..."
   */
  content: string;
  /**
   * Metadata object containing source, confidence, pageNumber, imageIndex, processingTime, etc.
   * @example {"source":"text","pageNumber":1}
   */
  metadata: object;
}

export interface QueryResponseDto {
  /**
   * The original query text
   * @example "What is machine learning?"
   */
  query: string;
  /**
   * AI-generated answer based on the retrieved context
   * @example "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed."
   */
  answer: string;
  /** Array of source chunks used to generate the answer */
  sources: QuerySourceDto[];
}

export interface DocumentItemDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  userId: string;
  /** @example "doc_1234567890.pdf" */
  filename: string;
  /** @example "my-document.pdf" */
  originalName: string;
  /**
   * File size in bytes
   * @example 1024000
   */
  fileSize: number;
  /**
   * MIME type
   * @example "application/pdf"
   */
  mimeType: string;
  /**
   * Processing status
   * @example "COMPLETED"
   */
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  /**
   * Total number of chunks
   * @example 15
   */
  totalChunks: number;
  /**
   * Document visibility
   * @example "PRIVATE"
   */
  visibility: "PUBLIC" | "PRIVATE";
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  updatedAt: string;
  /**
   * User information
   * @example {"id":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","name":"John Doe","email":"user@example.com","major":"ptik"}
   */
  user: object;
  /**
   * Aggregated counts
   * @example {"chunks":15}
   */
  _count: object;
}

export interface PaginationMetaDto {
  /**
   * Total number of documents
   * @example 50
   */
  total: number;
  /**
   * Current page number
   * @example 1
   */
  page: number;
  /**
   * Items per page
   * @example 10
   */
  limit: number;
  /**
   * Total number of pages
   * @example 5
   */
  totalPages: number;
}

export interface PaginatedDocumentsResponseDto {
  /** Array of documents */
  data: DocumentItemDto[];
  /** Pagination metadata */
  meta: PaginationMetaDto;
}

export interface DocumentUserDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "John Doe" */
  name: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "ptik" */
  major: string;
}

export interface DocumentCountDto {
  /**
   * Number of chunks in the document
   * @example 15
   */
  chunks: number;
}

export interface DocumentDetailResponseDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  userId: string;
  /** @example "doc_1234567890.pdf" */
  filename: string;
  /** @example "my-document.pdf" */
  originalName: string;
  /**
   * File size in bytes
   * @example 1024000
   */
  fileSize: number;
  /**
   * MIME type of the document
   * @example "application/pdf"
   */
  mimeType: string;
  /**
   * Processing status of the document
   * @example "COMPLETED"
   */
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  /**
   * Total number of chunks
   * @example 15
   */
  totalChunks: number;
  /**
   * Document visibility (PUBLIC or PRIVATE)
   * @example "PRIVATE"
   */
  visibility: "PUBLIC" | "PRIVATE";
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-15T10:30:00.000Z"
   */
  updatedAt: string;
  /** User who uploaded the document */
  user: DocumentUserDto;
  /** Chunk count information */
  _count: DocumentCountDto;
}

export interface DeleteResponseDto {
  /**
   * Success message
   * @example "Document and all chunks deleted successfully"
   */
  message: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title RAG Education System API
 * @version 1.0
 * @contact
 *
 * API documentation for the RAG Education System by Nabhan Arroofi Arpansi
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Health
     * @name AppControllerGetHello
     * @summary Health check endpoint
     * @request GET:/api
     */
    appControllerGetHello: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegister
     * @summary Register a new user
     * @request POST:/api/auth/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<RegisterResponseDto, void>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @summary User login
     * @request POST:/api/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, void>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerGetCurrentUser
     * @summary Get current user profile
     * @request GET:/api/users/me
     * @secure
     */
    usersControllerGetCurrentUser: (params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdateUserRole
     * @summary Update user role (admin only)
     * @request PATCH:/api/users/{id}/role
     * @secure
     */
    usersControllerUpdateUserRole: (
      id: string,
      data: UpdateRoleDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/${id}/role`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerGetUserById
     * @summary Get user by ID
     * @request GET:/api/users/{id}
     * @secure
     */
    usersControllerGetUserById: (id: string, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdateUser
     * @summary Update user data
     * @request PATCH:/api/users/{id}
     * @secure
     */
    usersControllerUpdateUser: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Documents
     * @name DocumentsControllerUploadDocument
     * @summary Upload PDF or image document (PNG, JPG, JPEG)
     * @request POST:/api/documents/upload
     * @secure
     */
    documentsControllerUploadDocument: (
      data: {
        /**
         * PDF or image file (PNG, JPG, JPEG)
         * @format binary
         */
        file?: File;
        /** @default "PRIVATE" */
        visibility?: "PUBLIC" | "PRIVATE";
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadResponseDto, void>({
        path: `/api/documents/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Documents
     * @name DocumentsControllerUpdateDocumentVisibility
     * @summary Update document visibility (owner only)
     * @request PATCH:/api/documents/{id}/visibility
     * @secure
     */
    documentsControllerUpdateDocumentVisibility: (
      id: string,
      data: UpdateVisibilityDto,
      params: RequestParams = {},
    ) =>
      this.request<DocumentResponseDto, void>({
        path: `/api/documents/${id}/visibility`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Documents
     * @name DocumentsControllerQueryDocuments
     * @summary Query documents using RAG (Retrieval-Augmented Generation)
     * @request POST:/api/documents/query
     * @secure
     */
    documentsControllerQueryDocuments: (
      data: QueryDocumentDto,
      params: RequestParams = {},
    ) =>
      this.request<QueryResponseDto, void>({
        path: `/api/documents/query`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Documents
     * @name DocumentsControllerListDocuments
     * @summary Get all documents with pagination
     * @request GET:/api/documents
     * @secure
     */
    documentsControllerListDocuments: (
      query?: {
        /**
         * Page number
         * @min 1
         * @default 1
         * @example 1
         */
        page?: number;
        /**
         * Items per page
         * @min 1
         * @default 10
         * @example 10
         */
        limit?: number;
        /** Filter by document status */
        status?: "PROCESSING" | "COMPLETED" | "FAILED";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedDocumentsResponseDto, any>({
        path: `/api/documents`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Documents
     * @name DocumentsControllerGetDocumentById
     * @summary Get document by ID
     * @request GET:/api/documents/{id}
     * @secure
     */
    documentsControllerGetDocumentById: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<DocumentDetailResponseDto, void>({
        path: `/api/documents/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Documents
     * @name DocumentsControllerDeleteDocument
     * @summary Delete document and all its chunks
     * @request DELETE:/api/documents/{id}
     * @secure
     */
    documentsControllerDeleteDocument: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<DeleteResponseDto, void>({
        path: `/api/documents/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
