<div align="center">
<h1>Banking APIs 💰</h1>
</div>

# Table of Contents

- [Common notions](#common-notions)
- [Common schemas](#common-schemas)
- [Wallet APIs](./card/README.md)
- [Card APIs](./card/README.md)
- [CardWallet APIs aka Transfer](./card/README.md)

## Common notions

All APIs are exposed by http request and we suppose that every client using Banking APIs are authenticated.
To be considered as authenticated, for each HTTP request, following headers must be provided

| Header field | Type   | Format | description |
| ------------ | ------ | ------ | ----------- |
| x-user-id    | string |        | user ID     |
| x-company-id | string |        | company ID  |

## Common schemas

### Currency

Type: `Enum`
Values: `USD` | `GBP` | `EUR`
