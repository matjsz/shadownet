const {connect, netrunners} = require('./utils/handleConnection')
const chalk = require('chalk')
const fs = require('fs')

// DEBUG DATA - NOT GOING TO THE FINAL VERSION

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
    if(args[1] == 'id'){
        fs.readFile('./id.txt', 'utf-8', (err, data) => {
            if(err){
                console.log(err)
            }
            netrunners(data, args[2], args[3])  
        })
    } else{
        netrunners(args[1], args[2], args[3])
    }
}

function saveId(args){
    fs.writeFile('./id.txt', args[1], err => {
        if(err){
            console.log(err)
        }
    })

    console.log('\nID succesfully saved!')
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
    'save-id': {
        'loa': 2,
        'help': "saves your id so you don't need to write it everytime you need to use it.",
        'args': {
            '[id]': 'your id'
        },
        'f': saveId
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

// connect('z6HihjzJxPc2gsuwROpM')
