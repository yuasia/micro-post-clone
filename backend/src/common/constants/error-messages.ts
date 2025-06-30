// src/common/constants/error-messages.ts
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'メールアドレスまたはパスワードが正しくありません',
    USER_NOT_FOUND: 'ユーザーが見つかりません',
    USER_ALREADY_EXISTS: 'そのユーザーは既に存在します',
    INVALID_OTP: 'ワンタイムパスワードが無効です',
    OTP_EXPIRED: 'ワンタイムパスワードが期限切れです',
    INVALID_TOKEN_TYPE: '無効なトークンタイプです',
    INVALID_TOKEN: 'トークンが無効または期限切れです',
    EMAIL_SEND_FAILED:
      'メール送信に失敗しました。しばらく経ってから再度お試しください',
    RESET_EMAIL_SEND_FAILED:
      'パスワードリセットメールの送信に失敗しました。しばらく経ってから再度お試しください',
    INVALID_PASSWORD: '現在のパスワードが正しくありません',
  },
  VALIDATION: {
    REQUIRED_FIELD: '必須項目です',
    INVALID_EMAIL: 'メールアドレスの形式が正しくありません',
    EMAIL_ALREADY_EXISTS: 'そのメールアドレスは既に使用されています',
    INVALID_PASSWORD_FORMAT:
      'パスワードは6文字以上20文字以下で、英小文字と数字を含める必要があります',
    CURRENT_PASS_REQUIRED: '現在のパスワードを入力してください',
  },
  EXTERNAL_SERVICE: {
    EMAIL_SEND_FAILED:
      'メール送信に失敗しました。しばらく経ってから再度お試しください',
  },
  DATABASE: {
    POST: {
      CREATION_FAILED: '投稿の作成に失敗しました',
      FETCH_FAILED: '投稿の取得に失敗しました',
      DELETE_FAILED: '投稿の削除に失敗しました',
    },
    USER: {
      CREATION_FAILED: 'ユーザーの作成に失敗しました',
      UPDATE_FAILED: 'ユーザー情報の更新に失敗しました',
      FETCH_FAILED: 'ユーザー情報の取得に失敗しました',
      DELETE_FAILED: 'ユーザーの削除に失敗しました',
    },
    AUTH: {
      DELETE_FAILED: '認証情報の削除に失敗しました',
    },
    PASSWORD: {
      CREATION_FAILED: 'トークンの作成に失敗しました',
      DELETE_FAILED: 'トークンの初期化に失敗しました',
    },
  },
} as const;
