const { io } = require("socket.io-client")
const chalk = require('chalk')
const prompt = require('prompt-sync')()

const serverUrl = 'https://shadownet-server.herokuapp.com/'
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

const connect = (id) => {
    console.log(`\n[${chalk.blue.bold('CONNECTING')}] Waiting for server response...`)

    // Connection
    const socket = io(serverUrl, {
        auth: {
            userID: id 
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
}

const netrunners = (id, arg, netrunner) => {
    console.log(`\n[${chalk.blue.bold('CONNECTING')}] Waiting for server response...`)

    // Connection
    const socket = io(serverUrl, {
        auth: {
            userID: id 
        }
    })

    // CLIENT EVENTS

    socket.on("connect", () => {
        if(id == null || id == undefined){
            console.log(`[${chalk.yellow.bold('DISCONNECTING')}] ID not provided. Closing connection.`)
            socket.disconnect()
        } else{
            console.log(`[${chalk.green.bold('CONNECTED')}] Succesfully connected to ${chalk.magenta.bold('ShadowNET')}.`)
        }

        if(arg == '-o'){
            socket.emit('get_all_online', id)
        } else if(arg == '-s'){
            socket.emit('get_netrunner', [id, netrunner])
        } else{
            socket.emit('get_all_netrunners', id)
        }
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

    socket.on("response_all_netrunners", (data) => {
        console.log('\nSHOWING ALL NETRUNNERS:')

        data.data.forEach((netrunner) => {
            console.log(`${chalk.yellow.bold(netrunner.username)} - ${levelOfAccess[netrunner.access_level]}`)
        })

        console.log('\n')

        const d = prompt('Press ENTER to disconnect...')
        socket.disconnect()
    })

    socket.on("bad_response", () => {
        console.log(`\n${chalk.red.bold("You don't have permission to do that.")}\n`)

        const d = prompt('Press ENTER to disconnect...')
        socket.disconnect()
    })

    socket.on("response_all_online", (data) => {
        console.log('\nSHOWING ALL NETRUNNERS ONLINE:')

        data.forEach((socketConnected) => {
            console.log(`${chalk.yellow.bold(socketConnected[0])} [${chalk.blue.bold('Session ID')}: ${socketConnected[1]}]`)
        })

        console.log('\n')

        const d = prompt('Press ENTER to disconnect...')
        socket.disconnect()
    })

    socket.on('response_netrunner', (data) => {
        if(data.username != undefined){
            console.log(`\nSHOWING ${chalk.yellow.bold(data.username)} info:`)

            console.log(`${chalk.yellow.bold(data.username)} - ${levelOfAccess[data.access_level]}`)

            console.log('\n')
        } else{
            console.log(`${chalk.red.bold('\nUser not found!\n')}`)
        }

        const d = prompt('Press ENTER to disconnect...')
        socket.disconnect()
    })
}

module.exports.connect = connect
module.exports.netrunners = netrunners