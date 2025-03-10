# from kafka import KafkaProducer, KafkaConsumer
# import json

# producer = KafkaProducer(bootstrap_servers="localhost:9092",api_version=(0,11,5),
#               value_serializer=lambda x: json.dumps(x).encode('utf-8'))
# consumer = KafkaConsumer("video_stream", bootstrap_servers="localhost:9092")

# def send_video_to_kafka(video_path):
#     with open(video_path, "rb") as f:
#         while chunk := f.read(4096):
#             producer.send("video_stream", chunk)
#     producer.flush()

# def receive_video():
#     with open("output.mp4", "wb") as f:
#         for message in consumer:
#             f.write(message.value)