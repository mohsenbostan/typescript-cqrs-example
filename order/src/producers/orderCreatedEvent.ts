import { Channel } from "amqplib";
import { Order } from "./../model";

export default async (channel: Channel, order: Order) => {
    try {
        const queue = "order.created";

        await channel.assertQueue(queue, { durable: true });

        const orderCreatedEvent = await channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(order))
        );

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
