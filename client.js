const {connect, netrunners, login} = require('./utils/handleConnection')
const chalk = require('chalk')
const fs = require('fs')

// DEBUG DATA - NOT GOING TO THE FINAL VERSION
// TO-DO
// [X] Fix server forced shutdown while trying to run "netrunners -o" while logged in

// PLANED FEATURES
// [ ] Probe => control a infected computer remotely (connect to the server, then connect to one of the infected computers on the server via backdoor/exploit).
// [ ] Listen => listen to all the server's events.
// [ ] Yell => LOA: 0 | sends a message to all listeners conneted via listen.

// ---------------------------------------------------------------------------------

function help(){
    console.log(`\n2022 © ${chalk.magenta.bold('ShadowNET')} by ${chalk.blue.bold('matjs')}\n`)

    console.log(`\nAbout LOA (Level of Access):\n\nEvery ${chalk.yellow.bold('Netrunner')} have a LOA, it defines which command you can use on ${chalk.magenta.bold('ShadowNET')}.\n`)

    for(l in Object.keys(loas)){
        console.log(`${chalk.yellow.bold(l)} - ${loas[l]}`)
    }

    console.log('\n')

    for(i in Object.keys(commands)){
        console.log(`${chalk.red.bold(Object.keys(commands)[i])} [LOA: ${chalk.yellow.bold(commands[Object.keys(commands)[i]]['loa'])}] - ${commands[Object.keys(commands)[i]]['help']}`)
        for(j in Object.keys(commands[Object.keys(commands)[i]]['args'])){
            console.log(`   ${chalk.red.bold(Object.keys(commands[Object.keys(commands)[i]]['args'])[j])} - ${commands[Object.keys(commands)[i]]['args'][Object.keys(commands[Object.keys(commands)[i]]['args'])[j]]}`)
        }
    }
}

function netrunnersCMD(args){
    const tokenFile = JSON.parse(fs.readFileSync('./auth0.json', {encoding: 'utf-8'}))
    netrunners(tokenFile.token, args[1], args[2])
}

function loginCMD(args){
    login(args[1], args[2])

    setTimeout(() => {
        const data = fs.readFileSync('./mdtk.json', {encoding: 'utf-8'})
        fs.writeFileSync('./auth0.json', data)
    }, 2000)
}

// Levels of Access
var loas={
    0: 'Admin',
    1: 'Moderator',
    2: 'Member'
}

var commands = {
    'help': {
        'loa': 2,
        'help': 'shows this command.',
        'args': {
            '[command]': 'shows info about a command'
        },
        'f': help
    },
    'login': {
        'loa': 2,
        'help': "logins into ShadowNET system.",
        'args': {
            '[id]': 'your id',
            '[pass]': 'your pass'
        },
        'f': loginCMD
    },
    'netrunners': {
        'loa': 0,
        'help': 'shows all the netrunners registered on the shadownet',
        'args': {
            '[id] (REQUIRED)': 'your id',
            '-a (optional)': 'shows all the netrunners.',
            '-s (optional)': 'shows an specific netrunner.',
            '-o (optional)': 'shows all online netrunners.'
        },
        'f': netrunnersCMD
    }
}

if(Object.keys(commands).includes(process.argv.slice(2)[0])){
    commands[process.argv.slice(2)[0]]['f'](process.argv.slice(2))
} else{
    commands['help']['f']()
}