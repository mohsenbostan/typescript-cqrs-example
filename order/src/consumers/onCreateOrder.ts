import { Channel, ConsumeMessage } from "amqplib";
import orderCreatedEvent from "../producers/orderCreatedEvent";

export default async (channel: Channel) => {
    const queue = "order.create";
    console.log(`[x] Awaiting messages in ${queue}`);

    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (message: ConsumeMessage | null) => {
        if (message) {
            try {
                const order = JSON.parse(message.content.toString());
                console.log(`[x] Received order: ${order.id}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const orderCreated = await orderCreatedEvent(channel, order);

                if (orderCreated) {
                    console.log(`[x] Done processing order: ${order.id}`);
                    channel.ack(message);
                }
            } catch (error) {
                console.error(error);
                channel.nack(message);
            }
        }
    });
};
