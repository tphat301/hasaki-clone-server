export enum VerifyStatusAccount {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum StatusCart {
  UnActive = '-1',
  Active = '1'
}

export enum Order {
  Desc = 'desc',
  Asc = 'asc'
}

export enum SortBy {
  CreatedAt = 'created_at',
  View = 'view',
  Sold = 'sold',
  Price = 'price'
}
