# AvantGarde Backend

Server worker to generate images with tensorflow

## Call example:

```bash
curl --location --request POST 'http://localhost:8080/api/generate' --header 'Content-Type: application/json' --data-raw '{ "address": "0x24C08142dD48ca242DdC2D08220666f7F1d5bB3f" }'
```

## Develop

Start development server

`npm run dev`
