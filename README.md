# CQRS Implementation In Node.js With TypeScript

### Setup RabbitMQ

first install [RabbitMQ](https://www.rabbitmq.com/download.html) or use docker-compose:

```
docker-compose up -d
```

### Setup Express Server

```
cd web
npm install
npm run start
```

### Services

this is a list of services:

-   [x] order
-   [ ] user

#### Setup services consumers

```
cd <service-name>
npm install
npm run start
```

### List of API endpoints

hello world

```
GET /
```

create new order

```
POST /order

example body:
{
    "id": "1",
    "name": "test",
    "price": "100",
    "quantity": "1"
}
```
