import express, { Express } from "express";
import amqplib from "amqplib";
import createOrderEevent from "./producers/createOrderEvent";

(async () => {
    // create amqp connection
    const connection = await amqplib.connect("amqp://localhost");
    console.log("Connected to RabbitMQ");

    // create channel
    const channel = await connection.createChannel();
    console.log("Channel created");

    // create express app
    const app: Express = express();

    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.post("/order", async (req, res) => {
        const order = req.body;
        console.log("Order received: ", order);

        if (order) {
            // publish event
            await createOrderEevent(channel, order);

            return res.json("Order created");
        }

        return res.status(400).json("Invalid order");
    });

    // start server
    app.listen(3000, () => {
        console.log("Server started");
    });
})();
