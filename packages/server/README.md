# AvantGarde Backend

Server worker to generate images with tensorflow

## Call example:

### Generate

```bash
curl --location --request POST 'http://localhost:3000/api/generate' --header 'Content-Type: application/json' --data-raw '{ "address": "0x24C08142dD48ca242DdC2D08220666f7F1d5bB3f" }'
```

### txHook

```bash
curl --location --request POST 'http://localhost:3000/api/txHook' --header 'Content-Type: application/json' --header 'Hook-Secret: 1d8c3623fb5ae3e6da37edfaad82794be462' --data-raw '{ "network": "kovan", "contractAddress": "0xD5bC431D0CEF8747E4898Aa76f8956646084302a", "txHash": "0x6ad1230a9f0566ab3ae4b9c33d451d8c3623fb5ae3e6da37edfaad82794be462" }'
```
