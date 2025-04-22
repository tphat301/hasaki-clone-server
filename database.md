### Collection users

```ts
export enum VerifyStatusAccount {
  Unverified,
  Verified,
  Banned
}
interface User {
  _id: ObjectId
  email: string
  password: string
  name: string
  email_verify_token: string
  forgot_password_token: string
  date_of_birth: Date
  verify: VerifyStatusAccount
  address: string
  phone: string
  avatar: string
  created_at: Date
  updated_at: Date
}
```

## Respone Register && Login

Trả về client 1 Object

```js
{
  message: string,
  data: {
    access_token: string,
    refresh_token: string,
    expires_access_token: string,
    expires_refresh_token: string,
    user: User
  }
}
```

### Collection admins

```ts
export enum VerifyStatusAccount {
  Unverified,
  Verified,
  Banned
}
interface Admin {
  _id: ObjectId
  email: string
  password: string
  name: string
  email_verify_token: string
  forgot_password_token: string
  date_of_birth: Date
  verify: VerifyStatusAccount
  address: string
  phone: string
  avatar: string
  created_at: Date
  updated_at: Date
}
```

## Respone Register && Login

Trả về client 1 Object

```js
{
  message: string,
  data: {
    access_token: string,
    refresh_token: string,
    expires_access_token: string,
    expires_refresh_token: string,
    user: User
  }
}
```
