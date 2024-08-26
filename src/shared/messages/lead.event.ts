export class Message {
  text: string;

  constructor(data) {
    const topic = process.env.KAFKA_BROKERS_TOPIC;

    this.text = JSON.stringify({
      messageId: '' + new Date().valueOf(),
      body: data,
      messageType: 'lead',
      topicName: topic,
    });
  }
}
