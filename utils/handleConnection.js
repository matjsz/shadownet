const { io } = require("socket.io-client")
const chalk = require('chalk')
const prompt = require('prompt-sync')()
const fs = require('fs')

// TO-DO
// [ ] Fix server forced shutdown while trying to run "netrunners -o" while logged in

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

const connect = (token) => {
    console.log(`\n[${chalk.blue.bold('CONNECTING')}] Waiting for server response...`)

    // Connection
    const socket = io(serverUrl, {
        auth: {
            token: token 
        }
    })

    // CLIENT EVENTS

    socket.on("connect", () => {
        if(token == null || token == undefined || token == ""){
            console.log(`[${chalk.yellow.bold('DISCONNECTING')}] Token not provided. Closing connection.`)
            socket.disconnect()
        } else{
            console.log(`[${chalk.green.bold('CONNECTED')}] Succesfully connected to ${chalk.magenta.bold('ShadowNET')}.`)

            console.log(`[${chalk.blue.bold('INFO')}] Checking your authentication token...`)
            socket.emit('check_token', token)
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

    socket.on('token_found', (data) => {
        console.log(`[${chalk.green.bold('APPROVED')}] Your token was succesfully approved.`)

        // Do your things
        // data = user data catched from API
        // socket.emit('do this', data)
    })

    socket.on('token_not_found', () => {
        console.log(`[${chalk.red.bold('DENIED')}] Your token was rejected.`)
        socket.disconnect()
    })
}

const login = (id, pass) => {
    console.log(`\n[${chalk.blue.bold('CONNECTING')}] Waiting for server response...`)

    // Connection
    const socket = io(serverUrl, {
        auth: {
            id: id,
            pass: pass,
            token: ''
        }
    })

    // CLIENT EVENTS

    socket.on("connect", () => {
        console.log(`[${chalk.green.bold('CONNECTED')}] Succesfully connected to ${chalk.magenta.bold('ShadowNET')}.`)
        console.log(`[${chalk.blue.bold('INFO')}] Verifying your credentials...`)
        socket.emit('try_to_login', [id, pass])
    })

    socket.on("connect_error", () => {
        console.log(`[${chalk.blue.bold('RESTABLISHING')}] Lost connection to ${chalk.magenta.bold('ShadowNET')}. Trying to restablish connection...`)
    })

    socket.on("disconnect", (reason) => {
        console.log(`[${chalk.red.bold('DISCONNECTED')}] Connection to ${chalk.magenta.bold('ShadowNET')} closed. => ${disconnectionReasons[reason]}`)
    })

    socket.on("login_succesful", token => {
        console.log(`[${chalk.green.bold('APPROVED')}] Succesfully logged in to ${chalk.magenta.bold('ShadowNET')}. Your token will expire in 6 hours.`)

        var content = JSON.stringify({token: token})

        fs.writeFileSync('./mdtk.json', content)

        socket.disconnect()
    })

    socket.on("login_failed", () => {
        console.log(`[${chalk.red.bold('DENIED')}] Your credentials has been denied. Try again.`)
        socket.disconnect()
    })
}

const netrunners = (token, arg, netrunner) => {
    console.log(`\n[${chalk.blue.bold('CONNECTING')}] Waiting for server response...`)

    // Connection
    const socket = io(serverUrl, {
        auth: {
            token: token 
        }
    })

    // CLIENT EVENTS

    socket.on("connect", () => {
        if(token == null || token == undefined || token == ""){
            console.log(`[${chalk.yellow.bold('DISCONNECTING')}] Token not provided. Closing connection.`)
            socket.disconnect()
        } else{
            console.log(`[${chalk.green.bold('CONNECTED')}] Succesfully connected to ${chalk.magenta.bold('ShadowNET')}.`)

            console.log(`[${chalk.blue.bold('INFO')}] Checking your authentication token...`)
            socket.emit('check_token', token)
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

    socket.on('token_found', (data) => {
        console.log(`[${chalk.green.bold('APPROVED')}] Your token was succesfully approved.`)

        if(arg == '-o'){
            socket.emit('get_all_online', data.id)
        } else if(arg == '-s'){
            socket.emit('get_netrunner', [data.id, netrunner])
        } else{
            socket.emit('get_all_netrunners', data.id)
        }
    })

    socket.on('token_not_found', () => {
        console.log(`[${chalk.red.bold('DENIED')}] Your token was rejected.`)
        socket.disconnect()
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
module.exports.login = login