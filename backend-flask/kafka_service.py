from kafka import KafkaProducer, KafkaConsumer
import json

# Kafka producer setup
def create_kafka_producer():
    producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],  # Kafka server
        value_serializer=lambda v: json.dumps(v).encode('utf-8')  # Serializing data to send as JSON
    )
    return producer

# Kafka consumer setup (for consuming messages)
def create_kafka_consumer():
    consumer = KafkaConsumer(
        'video_upload',  
        bootstrap_servers=['localhost:9092'],
        group_id='your_consumer_group',  
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )
    return consumer

def send_to_kafka(topic, message):
    producer = KafkaProducer(
        bootstrap_servers='localhost:9092',
        value_serializer=lambda x: json.dumps(x).encode('utf-8')
    )
    producer.send(topic, value=message)
    producer.flush()

def consume_from_kafka(topic):
    consumer = KafkaConsumer(
        topic,
        bootstrap_servers='localhost:9092',
        group_id='video_consumer_group',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )
    for message in consumer:
        print(f"Received: {message.value}")
