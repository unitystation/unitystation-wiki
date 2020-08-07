import requests
import json
from pprint import pprint

url = "https://api.unitystation.org/serverlist"


@env.macro
def get_server_data():
    response = json.loads(requests.get(url).text)
    return response


if __name__ == "__main__":
    pprint(get_server_data())
