import requests
import json
from pprint import pprint

url = "https://api.unitystation.org/serverlist"

shiet = \
    """
<div class="card" style="width: 18rem;">
  <div class="card-header">
    {}
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">IP: {} Port: {}</li>
    <li class="list-group-item">Map: {}</li>
    <li class="list-group-item">Game mode: {}</li>
    <li class="list-group-item">Players: {}</li>
  </ul>
</div>
<br>
"""


@env.macro
def get_server_data():
    response = json.loads(requests.get(url).text)
    # pprint(response)

    html = build_html(response)

    return html


def build_html(api_response):
    html = ""

    for server in api_response["servers"]:
        name = server["ServerName"]
        ip = server["ServerIP"]
        port = server["ServerPort"]
        map = server["CurrentMap"]
        gamemode = server["GameMode"]
        players = server["PlayerCount"]

        html += shiet.format(name, ip, port, map, gamemode, players)

    return html


if __name__ == "__main__":
    pprint(get_server_data())
