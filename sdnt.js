const {connect, netrunners, login, probe, listen, yell} = require('./utils/handleConnection')
const chalk = require('chalk')
const fs = require('fs')

// DEBUG DATA - NOT GOING TO THE FINAL VERSION
// TO-DO

// PLANED FEATURES
// [ ] DDoS - Control all the probes at the same time

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

function probeCMD(args){
    const tokenFile = JSON.parse(fs.readFileSync('./auth0.json', {encoding: 'utf-8'}))
    probe(tokenFile.token, args[1], args[2])
}

function listenCMD(args){
    const tokenFile = JSON.parse(fs.readFileSync('./auth0.json', {encoding: 'utf-8'}))
    listen(tokenFile.token, args[1], args[2])
}

function yellCMD(args){
    const tokenFile = JSON.parse(fs.readFileSync('./auth0.json', {encoding: 'utf-8'}))
    yell(tokenFile.token, args[1], args[2])
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
            '[id]': 'your id.',
            '[pass]': 'your pass.'
        },
        'f': loginCMD
    },
    'netrunners': {
        'loa': 0,
        'help': 'shows all the netrunners registered on the shadownet.',
        'args': {
            '-a (optional)': 'shows all the netrunners.',
            '-s (optional)': 'shows an specific netrunner.',
            '-o (optional)': 'shows all online netrunners.'
        },
        'f': netrunnersCMD
    },
    'probe': {
        'loa': 1,
        'help': 'executes a remote command to an infected machine connected to the shadownet.',
        'args': {
            '[probe-id]': 'the target probe id.',
            '[cmd]': 'the command to execute remotely.'
        },
        'f': probeCMD
    },
    'listen': {
        'loa': 2,
        'help': 'listen to global events on the shadownet.',
        'args': {
            '': ''
        },
        'f': listenCMD
    },
    'yell': {
        'loa': 1,
        'help': 'sends a global event to all the netrunners connected to the shadownet.',
        'args': {
            '[message]': 'the message to send on the global event.',
            '[type]': 'the type of message.'
        },
        'f': yellCMD
    }
}

if(Object.keys(commands).includes(process.argv.slice(2)[0])){
    commands[process.argv.slice(2)[0]]['f'](process.argv.slice(2))
} else{
    commands['help']['f']()
}