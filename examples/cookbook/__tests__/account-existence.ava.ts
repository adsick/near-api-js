import { workspace } from './main.ava'
import { fork, exec } from 'child_process'
import { providers } from 'near-api-js'
workspace.test('check account existence', async (test, { root }) => {
    test.log('todo')

    let pwd = exec('pwd', (error, stdout, stderr) => {
        console.log('pwd: ' + stdout)
    })

    // pwd.on('spawn', ()=>{console.log('pwd spawned')})
    // pwd.on('error', (err)=>{console.log(`pwd error: ${err}`)})
    // pwd.on('message', (msg)=>{console.log(`pwd message: ${msg}`)})
    // pwd.on('exit', (code, signal)=>{console.log(`pwd exit, code: ${code}, signal: ${signal}`)})
    // pwd.on('close', (code, signal)=>{console.log(`pwd exit, code: ${code}, signal: ${signal}`)})

    let child = fork('utils/check-account-existence.js', [], { stdio: 'pipe'});
    console.log('child connected: ' + child.connected)
    child.on('spawn', ()=>{console.log("child  spawned")})
    child.on('error', (err)=>{console.log(`child  error: ${err}`)})

    child.on('exit', (code, signal)=>{console.log(`child exit, code: ${code}, signal: ${signal}`)})
    child.on('close', (code, signal)=>{console.log(`child closed, code: ${code}, signal: ${signal}`)})

    child.on('disconnect', ()=>{console.log('child disconnected');})

    child.stderr.on('data', data =>{
        console.log(`stderr from child: ${data}`)
    })

    child.stdout.on('data', data =>{
        console.log(`stdout from child: ${data}`)
    })

    sleep(15000)
})

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


workspace.test('check account existence (require)', async (test, { root })=>{
    // let cae = require('../utils/check-account-existence')
    // //won't work on another machine/session
    // //need to know how to get node's local url
    // cae.provider = new providers.JsonRpcProvider("http://localhost:3792/") 
    // await cae.accountExists();
})