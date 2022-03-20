# 매뉴얼: https://github.com/twitterdev/twitter-aws-samples/tree/master/kinesis
import sys
from time import sleep
import boto3
import requests
import os
from dotenv import load_dotenv

from botocore.exceptions import ClientError

url = "https://api.twitter.com/2/tweets/sample/stream"

load_dotenv()
# bearer_token = os.getenv("bearer_token")

bearer_token = os.environ.get("bearer_token")


def create_headers(bearer_token):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    return headers


# Replace with appropriate delivery stream name
aws_delivery_stream_name = 'DailyKpop_Twitter'


def stream_connect(headers):
    kinesis_client = boto3.client(
        'firehose',
        region_name=os.environ.get("aws_region"),
        aws_access_key_id=os.environ.get("aws_access_key_id"),
        aws_secret_access_key=os.environ.get("aws_secret_access_key"))

    response = requests.request("GET", url, headers=headers, stream=True)
    if response.status_code != 200:
        raise Exception(
            "Request returned an error: {} {}".format(
                response.status_code, response.text
            )
        )
    for response_line in response.iter_lines():
        if response_line:
            try:
                kinesis_client.put_record(
                    DeliveryStreamName=aws_delivery_stream_name,
                    Record={'Data': response_line.decode("utf-8")})
            except ClientError as e:
                print(e, file=sys.stderr)


def main():
    bearer_token = os.environ.get("bearer_token")
    if bearer_token is not None:
        print("processing...")
        headers = create_headers(bearer_token)
        retry = 0
        while True:
            stream_connect(headers)
            wait_seconds = 2 ** retry
            sleep(wait_seconds if wait_seconds < 900 else 900)
            retry += 1
    else:
        print("에러")


if __name__ == '__main__':
    main()
