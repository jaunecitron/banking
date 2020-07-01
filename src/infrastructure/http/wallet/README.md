# Schemas

## WalletRequest

Type: `JSON`

| Field     | Type   | Format              | description                       |
| --------- | ------ | ------------------- | --------------------------------- |
| companyId | string |                     | company ID                        |
| currency  | string |                     | [currency](../README.md#currency) |
| balance   | number | two decimals number | optional balance                  |

## Wallet

Type: `JSON`

| Field     | Type    | Format              | description                              |
| --------- | ------- | ------------------- | ---------------------------------------- |
| id        | number  |                     | wallet ID                                |
| companyId | string  |                     | company ID                               |
| currency  | string  |                     | [currency](../README.md#currency)        |
| balance   | number  | two decimals number | balance                                  |
| isMaster  | boolean |                     | master wallet flag, only one by currency |

# APIs

## CreateWallet API

### URL

`POST /wallet`

### Headers

See [common notions](../README.md#common-notions)

### Request body

Type: [WalletRequest](#walletrequest)

### Response

| Status | Payload type      | Description     |
| ------ | ----------------- | --------------- |
| 201    | [Wallet](#wallet) | Wallet created  |
| 400    |                   | Invalid payload |

## ListWallet API

### URL

`GET /wallet`

### Headers

See [common notions](../README.md#common-notions)

### Query string

| Name   | Type     | Format | Description        | Default value |
| ------ | -------- | ------ | ------------------ | ------------- |
| limit  | interger |        | max wallet in list | 10            |
| offset | integer  |        | offset             | 0             |

### Response

| Status | Payload type        | Description                                   |
| ------ | ------------------- | --------------------------------------------- |
| 200    | [Wallet[]](#wallet) | Wallet list for current authenticated company |
