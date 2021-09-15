import { Channel } from "amqplib";
import { Order } from "./../model";

export default async (channel: Channel, order: Order) => {
    try {
        const queue = "order.create";

        await channel.assertQueue(queue, { durable: true });

        const createOrderEvent = await channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(order))
        );

        console.log(`[x] Sent order create event to ${queue}`);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
