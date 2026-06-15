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

export interface DtoChunkSource {
  chunkIndex?: number;
  content?: string;
  documentId?: string;
  documentName?: string;
  lowConfidence?: boolean;
  pageNumber?: number;
  similarity?: number;
}

export interface DtoDocumentInfo {
  createdAt?: string;
  fileSize?: number;
  filename?: string;
  id?: string;
  mimeType?: string;
  originalName?: string;
  status?: string;
  totalChunks?: number;
  visibility?: string;
}

export interface DtoErrorResponse {
  /** @example "Something went wrong" */
  error?: string;
}

export interface DtoListDocumentsResponse {
  data?: DtoDocumentInfo[];
  meta?: DtoPaginationMeta;
}

export interface DtoLoginRequest {
  /** @example "user@example.com" */
  email: string;
  /** @example "password123" */
  password: string;
}

export interface DtoLoginSuccessResponse {
  /** @example "User logged in successfully" */
  message?: string;
  /** @example "eyJhbGciOiJIUzI1NiIs..." */
  token?: string;
  user?: DtoUserInfo;
}

export interface DtoMeResponse {
  /** @example "user@example.com" */
  email?: string;
  /** @example "Computer Science" */
  major?: string;
  /** @example "STUDENT" */
  role?: string;
  /** @example "550e8400-e29b-41d4-a716-446655440000" */
  userID?: string;
}

export interface DtoMessageResponse {
  /** @example "Operation successful" */
  message?: string;
}

export interface DtoPaginationMeta {
  limit?: number;
  page?: number;
  total?: number;
  totalPages?: number;
}

export interface DtoQueryDocumentRequest {
  query: string;
}

export interface DtoQueryDocumentResponse {
  answer?: string;
  query?: string;
  sources?: DtoChunkSource[];
}

export interface DtoRegisterRequest {
  /** @example "user@example.com" */
  email: string;
  /** @example "Computer Science" */
  major?: string;
  /** @example "John Doe" */
  name: string;
  /** @example "password123" */
  password: string;
  /** @example "STUDENT" */
  role?: "STUDENT" | "TEACHER" | "ADMIN";
}

export interface DtoRegisterSuccessResponse {
  /** @example "User registered successfully" */
  message?: string;
  user?: DtoUserInfo;
}

export interface DtoUploadDocumentResponse {
  filename?: string;
  id?: string;
  message?: string;
  status?: string;
}

export interface DtoUserInfo {
  /** @example "user@example.com" */
  email?: string;
  /** @example "550e8400-e29b-41d4-a716-446655440000" */
  id?: string;
  /** @example "password123" */
  initialPassword?: string;
  /** @example "Computer Science" */
  major?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example "STUDENT" */
  role?: string;
}

export interface DtoCreateUserRequest {
  email: string;
  major: string;
  name: string;
  password: string;
  role: "STUDENT" | "TEACHER";
}

export interface DtoUpdateUserRequest {
  email: string;
  major: string;
  name: string;
  password?: string;
  role: "STUDENT" | "TEACHER";
}

export interface DtoCreateUserResponse {
  message?: string;
  user?: DtoUserInfo;
}

export interface DtoUpdateUserResponse {
  message?: string;
  user?: DtoUserInfo;
}

export interface DtoListUsersResponse {
  data?: DtoUserInfo[];
}

export interface DtoBulkImportResult {
  row?: number;
  email?: string;
  name?: string;
  success?: boolean;
  error?: string;
  password?: string;
}

export interface DtoBulkImportUsersResponse {
  message?: string;
  total?: number;
  success?: number;
  failed?: number;
  results?: DtoBulkImportResult[];
}

export interface DtoAuthMeResponse {
  user?: DtoUserInfo;
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
 * @title RAG API
 * @version 1.0
 * @contact
 *
 * API documentation for the RAG (Retrieval-Augmented Generation) service
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Authenticate a user with email and password, returns a JWT token
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @summary Login user
     * @request POST:/api/auth/login
     */
    authLoginCreate: (request: DtoLoginRequest, params: RequestParams = {}) =>
      this.request<DtoLoginSuccessResponse, DtoErrorResponse>({
        path: `/api/auth/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get user info
     *
     * @tags Auth
     * @name AuthMeList
     * @summary Get user info
     * @request GET:/api/auth/me
     * @secure
     */
    authMeList: (params: RequestParams = {}) =>
      this.request<DtoAuthMeResponse, DtoErrorResponse>({
        path: `/api/auth/me`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new user account with email, password, name, major, and role
     *
     * @tags Auth
     * @name AuthRegisterCreate
     * @summary Register a new user
     * @request POST:/api/auth/register
     */
    authRegisterCreate: (
      request: DtoRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<DtoRegisterSuccessResponse, DtoErrorResponse>({
        path: `/api/auth/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a list of documents for the authenticated user
     *
     * @tags Documents
     * @name DocumentsList
     * @summary List documents
     * @request GET:/api/documents
     * @secure
     */
    documentsList: (
      query?: {
        /**
         * Page number
         * @default 1
         */
        page?: number;
        /**
         * Items per page
         * @default 10
         */
        limit?: number;
        /** Filter by status */
        status?: "PROCESSING" | "COMPLETED" | "FAILED";
      },
      params: RequestParams = {},
    ) =>
      this.request<DtoListDocumentsResponse, DtoErrorResponse>({
        path: `/api/documents`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Search documents using natural language and get AI-generated answer
     *
     * @tags Documents
     * @name DocumentsQueryCreate
     * @summary Query documents with RAG
     * @request POST:/api/documents/query
     * @secure
     */
    documentsQueryCreate: (
      request: DtoQueryDocumentRequest,
      params: RequestParams = {},
    ) =>
      this.request<DtoQueryDocumentResponse, DtoErrorResponse>({
        path: `/api/documents/query`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload a PDF or image file for processing
     *
     * @tags Documents
     * @name DocumentsUploadCreate
     * @summary Upload a document
     * @request POST:/api/documents/upload
     * @secure
     */
    documentsUploadCreate: (
      data: {
        /**
         * File to upload
         * @format binary
         */
        file: File;
        /**
         * Visibility (PUBLIC or PRIVATE)
         * @default "PRIVATE"
         */
        visibility?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DtoUploadDocumentResponse, DtoErrorResponse>({
        path: `/api/documents/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a single document's details
     *
     * @tags Documents
     * @name DocumentsDetail
     * @summary Get document by ID
     * @request GET:/api/documents/{id}
     * @secure
     */
    documentsDetail: (id: string, params: RequestParams = {}) =>
      this.request<DtoDocumentInfo, DtoErrorResponse>({
        path: `/api/documents/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Re-extract text and rebuild chunks/embeddings
     *
     * @tags Documents
     * @name DocumentsReprocess
     * @summary Reprocess a document
     * @request POST:/api/documents/{id}/reprocess
     * @secure
     */
    documentsReprocess: (id: string, params: RequestParams = {}) =>
      this.request<DtoUploadDocumentResponse, DtoErrorResponse>({
        path: `/api/documents/${id}/reprocess`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a document by ID
     *
     * @tags Documents
     * @name DocumentsDelete
     * @summary Delete a document
     * @request DELETE:/api/documents/{id}
     * @secure
     */
    documentsDelete: (id: string, params: RequestParams = {}) =>
      this.request<DtoMessageResponse, DtoErrorResponse>({
        path: `/api/documents/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Admin creates a STUDENT or TEACHER account
     *
     * @tags Users
     * @name UsersCreate
     * @summary Create user (admin only)
     * @request POST:/api/users
     * @secure
     */
    usersCreate: (
      request: DtoCreateUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<DtoCreateUserResponse, DtoErrorResponse>({
        path: `/api/users`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List all users (admin only)
     *
     * @tags Users
     * @name UsersList
     * @summary List users
     * @request GET:/api/users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<DtoListUsersResponse, DtoErrorResponse>({
        path: `/api/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Admin updates a STUDENT or TEACHER account
     *
     * @tags Users
     * @name UsersUpdate
     * @summary Update user (admin only)
     * @request PUT:/api/users/{id}
     * @secure
     */
    usersUpdate: (
      id: string,
      request: DtoUpdateUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<DtoUpdateUserResponse, DtoErrorResponse>({
        path: `/api/users/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Bulk import users from CSV/XLSX (admin only)
     *
     * @tags Users
     * @name UsersImportCreate
     * @summary Bulk import users
     * @request POST:/api/users/import
     * @secure
     */
    usersImportCreate: (
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<DtoBulkImportUsersResponse, DtoErrorResponse>({
        path: `/api/users/import`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Download CSV template for bulk user import (admin only)
     *
     * @tags Users
     * @name UsersImportTemplateList
     * @summary Download import template
     * @request GET:/api/users/import/template
     * @secure
     */
    usersImportTemplateList: (params: RequestParams = {}) =>
      this.request<string, DtoErrorResponse>({
        path: `/api/users/import/template`,
        method: "GET",
        secure: true,
        format: "text",
        ...params,
      }),
  };
}
