import cluster from "cluster";
import { cpus } from "os";
import process from "process";
import amqplib from "amqplib";
import onCreateOrder from "./consumers/onCreateOrder";

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    (async () => {
        try {
            // create amqp connection
            const connection = await amqplib.connect("amqp://localhost");
            console.log("Connected to RabbitMQ");

            // create channel
            const channel = await connection.createChannel();
            console.log("Channel created");

            // onCreateOrder consumer
            onCreateOrder(channel);
            console.log("onCreateOrder consumer created");
        } catch (error) {
            console.log(error);
        }
    })();

    console.log(`Worker ${process.pid} started`);
}
