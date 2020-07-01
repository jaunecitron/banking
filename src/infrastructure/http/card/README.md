# Schemas

## CardStatus

Type: `Enum`
Values: `OK` | `BLOCKED`

## CardRequest

Type: `JSON`

| Field    | Type   | Format  | description                       |
| -------- | ------ | ------- | --------------------------------- |
| walletId | number | integer | wallet ID                         |
| userId   | string |         | user ID                           |
| currency | string |         | [currency](../README.md#currency) |

## Card

Type: `JSON`

| Field          | Type   | Format                            | description                 |
| -------------- | ------ | --------------------------------- | --------------------------- |
| id             | number | integer                           | card ID                     |
| walletId       | number | integer                           | wallet ID                   |
| userId         | string |                                   | user ID                     |
| currency       | string | [currency](../README.md#currency) | currency                    |
| digits         | string | [0-9]{16}                         | card digits                 |
| ccv            | string | [0-9]{3}                          | card ccv                    |
| expirationDate | string | Date RFC 3339                     | card expiration date        |
| balance        | number | two decimals number               | card balance                |
| status         | string |                                   | [card status](#card-status) |

# APIs

## CreateCard API

### URL

`POST /card`

### Headers

See [common notions](../README.md#common-notions)

### Request body

Type: [CardRequest](#cardrequest)

### Response

| Status | Payload type  | Description     |
| ------ | ------------- | --------------- |
| 201    | [Card](#card) | Card created    |
| 400    |               | Invalid payload |

## ListCard API

### URL

`GET /card`

### Headers

See [common notions](../README.md#common-notions)

### Query string

| Name   | Type     | Format | Description       | Default value |
| ------ | -------- | ------ | ----------------- | ------------- |
| limit  | interger |        | max cards in list | 10            |
| offset | integer  |        | offset            | 0             |

### Response

| Status | Payload type    | Description                      |
| ------ | --------------- | -------------------------------- |
| 200    | [Card[]](#card) | Card list for authenticated user |

## UnblockCard API

### URL

`POST /card/:cardId/unblock`

### Headers

See [common notions](../README.md#common-notions)

### Parameters

| Name   | Type     | Format | Description |
| ------ | -------- | ------ | ----------- |
| cardId | interger |        | card ID     |

### Response

| Status | Payload type    | Description    |
| ------ | --------------- | -------------- |
| 200    | [Card[]](#card) | Card created   |
| 404    |                 | Card not found |
