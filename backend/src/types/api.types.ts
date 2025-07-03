// ==================== 共通レスポンス型 ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
}

export interface BaseUser {
  id: number;
  hash: string;
  otp?: string;
  otp_expire_at?: Date;
  name: string;
  email: string;
  avatar_url: string;
  created_at: Date;
  updated_at: Date;
}

// ==================== User Service 返り値型 ====================
export namespace UserAPI {
  export interface GetUserResponse extends ApiResponse<BaseUser> {}

  export interface CreateResponse
    extends ApiResponse<{
      id: number;
      name: string;
      email: string;
      created_at: Date;
    }> {}

  export interface UpdateResponse
    extends ApiResponse<{
      id: number;
      name: string;
      email: string;
      updated_at: Date;
    }> {}

  export interface DeleteResponse
    extends ApiResponse<{
      id: number;
      name: string;
    }> {}
}

// ==================== Post Service 返り値型 ====================
export namespace PostAPI {
  export interface PostResponse {
    id: number;
    user_id: number;
    content: string;
    user_name: string;
    avatar_url: string;
    created_at: Date;
  }

  export interface GetListResponse extends ApiResponse<PostResponse[]> {}
  export interface DeleteResponse extends ApiResponse<{ id: number }> {}
}

// ==================== Auth Service 返り値型 ====================
export namespace AuthAPI {
  export interface LoginResponse
    extends ApiResponse<{
      user_id: number;
      require_otp: boolean;
    }> {}

  export interface VerifyOTPResponse
    extends ApiResponse<{
      token: string;
      user_id: number;
      name: string;
      email: string;
      avatar_url: string;
    }> {}

  export interface ResetResponse
    extends ApiResponse<{
      user_id: number;
    }> {}
}
