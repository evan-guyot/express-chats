# Express Chats

This project is an API server made with **[Express.js](https://expressjs.com/)** in **[Typescript](https://www.typescriptlang.org/)**

## Rooms

#### API Methods

```http
GET /api/rooms
```

---

```http
GET /api/rooms/{id}
```

---

```http
POST /api/rooms
```

| Parameter     | Type                  |
| :------------ | :-------------------- |
| `name`        | _required_ - `string` |
| `description` | _required_ - `string` |

---

```http
PUT /api/rooms
```

| Parameter     | Type                  |
| :------------ | :-------------------- |
| `name`        | _required_ - `string` |
| `description` | _required_ - `string` |

## Authentication

Password is encrypted by Bcrypt and also Salted. A JWToken must be passed for all calls, expect for the authentication ones.

#### API Methods

```http
POST /api/auth/register
```

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `name`     | _required_ - `string` |
| `email`    | _required_ - `string` |
| `password` | _required_ - `string` |

---

```http
POST /api/auth/login
```

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `email`    | _required_ - `string` |
| `password` | _required_ - `string` |

## Chats

_Will be available soon.._

## Friends

_Will be available soon.._
