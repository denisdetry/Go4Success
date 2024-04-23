import os

import requests
from exponent_server_sdk import (
    PushClient,
    PushMessage,
)

# Optionally providing an access token within a session if you have enabled push security
session = requests.Session()
session.headers.update(
    {
        "Authorization": f"Bearer {os.getenv('EXPO_TOKEN')}",
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
    }
)


def send_push_message(token, message, extra=None):
    response = PushClient(session=session).publish(
        PushMessage(to=token,
                    body=message,
                    data=extra))

    return response
