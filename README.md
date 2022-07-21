![image](https://user-images.githubusercontent.com/54675543/180327662-f569be24-35c7-45df-804a-67b1e989ad45.png) 

## What is it?

ShadowNET is an interface/environment for group pen-testing in real time. It can be used by groups of white-hats for real-time pentesting in one single server, it can also be used to host a server for zombie devices and perform attacks.

More can be seen in the **Under development Documentation**

---

## Installation

This is the ShadowNET's client repository, you can see the server and the API server ones here: https://github.com/matjsilva/shadownet-server and https://github.com/matjsilva/shadownet-server

If you are really willing to download ShadowNET's client, then you are in the right place!

To install this version of the client, you just need to do this:

<code>> git clone https://github.com/matjsilva/shadownet.git</code> <br/>
<code>> cd shadownet</code> <br/>
<code>> npm i</code>

Then, after installing all the dependencies, you can start learning about the framework by running this command:

<code>> node client.js help</code>

## What it can do in the actual version

- Connect many devices in a single-channel network.

## What's coming in the next releases?

- ShadowNET's Probe: Remote connection to an infected device via backdoor (yes, performing console commands will be possible).
- ShadowNET's Zombie: Zombie network for infected devices.
- And many more...

## Why did i created ShadowNET?

I was in need of a multi-socket network server but i wasn't going to buy one and configure it from scratch. So i made a multi-socket network server from scratch.

ShadowNET is not only a server, it's also a whole framework based on custom commands and a unique structure for connection, and it will grow even more. Stay tuned.
