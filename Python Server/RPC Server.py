# work with few type of html <form>


import socket
from threading import Thread
import os
from urllib.parse import urlparse
import subprocess
import json
from pypresence import Presence
import time
from datetime import datetime
import threading
import asyncio

WWWROOT = r"..\\wwwroot\\"

client_id = "807310545291313163"
RPC = Presence(client_id)
RPC.connect()

RPC.update(
    state="Starting The App...",
    start=datetime.now().timestamp(),
    large_image="big"
)

oldState = ""


def refreshChecker():
    asyncio.set_event_loop(asyncio.new_event_loop())
    global RPC
    global oldState
    global client_id
    discordIDS = os.popen("wmic process where name='discord.exe' get processid").read(
    ).replace("ProcessId", "")
    discordPIDS = discordIDS.split("\n")
    discords = []
    counter = 0
    for i in discordPIDS:
        try:
            discords.append(int(i))
        except:
            pass
        counter = counter + 1
    oldChangedPID = discords[len(discords) - 1]
    while True:
        discordIDS = os.popen("wmic process where name='discord.exe' get processid").read(
        ).replace("ProcessId", "")
        discordPIDS = discordIDS.split("\n")
        discords = []
        counter = 0
        for i in discordPIDS:
            try:
                discords.append(int(i))
            except:
                pass
            counter = counter + 1
        newChangedPID = discords[len(discords) - 1]
        if oldChangedPID != newChangedPID:
            # asyncio.set_event_loop(asyncio.new_event_loop())
            time.sleep(5)
            OLDRPC = RPC
            OLDRPC.close()
            RPC = Presence(client_id)
            RPC.connect()
            RPC.update(
                state=oldState,
                start=datetime.now().timestamp(),
                large_image="big"
            )
            oldChangedPID = newChangedPID


thread = Thread(target=refreshChecker)
thread.start()


def notFound(line):
    msg = "HTTP/1.1 404 Not Found\r\n"
    data = "<h1>We did not found what you are looking for</h1>"
    data = data+"<h1>"+line+"</h1>"
    data = data+"<h1><marquee>404</marquee></h1>"
    msg = msg + "Content-Length:"+str(len(data))+"\r\n"
    msg = msg + "\r\n"+data
    msg = msg.encode()
    return msg


class HandleClient(Thread):
    clients = []  # class variable
    sessionId = None
    counter = 0

    def __init__(self, client_socket):
        Thread.__init__(self)
        self.client_socket = client_socket
        #print ("client open the socket",self.client_socket)
        HandleClient.clients.append(client_socket)

    def run(self):
        while(1):
            client_info = self.client_socket.recv(1024)
            if client_info == b"":  # chrome close the socket
                #print ("client close the socket",self.client_socket)
                # self.client_socket.close()
                break  # stop this thread

            client_info = client_info.decode()
            # print("-"*80)
            #print (HandleClient.counter, "browser request\n")
            HandleClient.counter += 1
            #print (client_info)

            headers = client_info.split('\r\n')
            firstLine = headers[0]
            firstLineParts = firstLine.split(' ')
            #print ( "firstLineParts",firstLineParts)
            httpCmd = firstLineParts[0]
            filename = firstLineParts[1]
            #print ( "filename", filename)

            parts = urlparse(firstLine)
            # print(parts)
            if httpCmd == "POST":
                if "drive" in filename[1:]:
                    global oldState
                    l1 = len(headers)
                    data = headers[l1 - 1]  # take the POST variables
                    data = json.loads(data)['data']['body']
                    if data != oldState:
                        try:
                            RPC.update(
                                state=data,
                                start=datetime.now().timestamp(),
                                large_image="big"
                            )
                        except:
                            pass
                        oldState = data
                        print("Changed presence to " + data)
            else:
                msg = notFound(firstLine)
            # self.client_socket.sendall(msg)


class Server():
    def __init__(self, port):
        self.server_socket = socket.socket()
        self.server_socket.bind(('0.0.0.0', 8080))
        self.server_socket.listen(5)
        print("server is listening")

    def go(self):
        while(1):
            (client_socket, client_address) = self.server_socket.accept()
            a = HandleClient(client_socket)
            a.start()


a = Server(8820)
a.go()
