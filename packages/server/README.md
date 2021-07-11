# AvantGarde Backend

Server worker to generate images with tensorflow

## Calls example:

### Generate

```bash
curl --location --request POST 'http://localhost:3001/api/generate' --header 'Content-Type: application/json' --data-raw '{ "address": "0x24C08142dD48ca242DdC2D08220666f7F1d5bB3f" }'
```

### Register

```bash
curl --location --request POST 'http://localhost:3001/api/register' --header 'Content-Type: application/json' --data-raw '{ "address": "0x24C08142dD48ca242DdC2D08220666f7F1d5bB3f" }'
```

### Invite

```bash
curl --location --request POST 'http://localhost:3001/api/invite' --header 'Content-Type: application/json' --data-raw '{ "address": "0x24C08142dD48ca242DdC2D08220666f7F1d5bB3f", "token": "" }'
```

### txHook

```bash
curl --location --request POST 'http://localhost:3001/api/txHook' --header 'Content-Type: application/json' --header 'Hook-Secret: 1d8c3623fb5ae3e6da37edfaad82794be462' --data-raw '{ "network": "rinkeby", "contractAddress": "0xf48855FF1E2C1683bFfC321738a8c08c28DC1Ad1", "txHash": "0x42e2031ddf4f046fa39550dcf2c0d121699918e834391518cf710eeca9dfcdb0" }'
```

### Redis cli

```bash
SCAN 0 MATCH *
SCAN 0 MATCH generate:*
SCAN 0 MATCH invite:code:*
SCAN 0 MATCH invite:addr:*
ZRANGEBYSCORE register 1 +inf WITHSCORES
ZRANGEBYSCORE invited 1 +inf WITHSCORES
```
