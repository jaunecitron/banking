# Schemas

## CardWallet

Type: `JSON`

| Field          | Type                                 | Format                            | description                 |
| -------------- | ------------------------------------ | --------------------------------- | --------------------------- |
| userId         | string                               |                                   | user ID                     |
| currency       | string                               | [currency](../README.md#currency) | currency                    |
| digits         | string                               | [0-9]{16}                         | card digits                 |
| ccv            | string                               | [0-9]{3}                          | card ccv                    |
| expirationDate | string                               | Date RFC 3339                     | card expiration date        |
| balance        | number                               | two decimals number               | card balance                |
| status         | string                               |                                   | [card status](#card-status) |
| id             | number                               | integer                           | card ID                     |
| wallet         | [Wallet](../wallet/README.md#wallet) |                                   | wallet                      |

# APIs

## LoadCardFromWallet API

### URL

`POST /wallet/:walletId/load/card/:cardId`

### Headers

See [common notions](../README.md#common-notions)

### Parameters

| Name     | Type     | Format | Description |
| -------- | -------- | ------ | ----------- |
| walletId | interger |        | wallet ID   |
| cardId   | interger |        | card ID     |

### Request body

Type: `JSON`

| Name   | Type   | Format              | Description |
| ------ | ------ | ------------------- | ----------- |
| amount | number | two decimals number | amount      |

### Response

| Status | Payload type              | Description            |
| ------ | ------------------------- | ---------------------- |
| 200    | [CardWallet](#cardwallet) | Card loaded            |
| 404    |                           | Wallet not found       |
| 404    |                           | Card not found         |
| 503    |                           | Conversion unavailable |

## UnloadCard API

### URL

`POST /card/:cardId/unload`

### Headers

See [common notions](../README.md#common-notions)

### Parameters

| Name   | Type     | Format | Description |
| ------ | -------- | ------ | ----------- |
| cardId | interger |        | card ID     |

### Response

| Status | Payload type              | Description            |
| ------ | ------------------------- | ---------------------- |
| 200    | [CardWallet](#cardwallet) | Card loaded            |
| 404    |                           | Wallet not found       |
| 404    |                           | Card not found         |
| 503    |                           | Conversion unavailable |

## BlockCard API

### URL

`POST /card/:cardId/block`

### Headers

See [common notions](../README.md#common-notions)

### Parameters

| Name   | Type     | Format | Description |
| ------ | -------- | ------ | ----------- |
| cardId | interger |        | card ID     |

### Response

| Status | Payload type                                       | Description            |
| ------ | -------------------------------------------------- | ---------------------- |
| 200    | [CardWallet](#cardwallet) with status as `BLOCKED` | Card loaded            |
| 404    |                                                    | Wallet not found       |
| 404    |                                                    | Card not found         |
| 503    |                                                    | Conversion unavailable |
