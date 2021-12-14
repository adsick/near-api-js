import { workspace } from './main.ava'
import { fork, spawn, exec } from 'child_process'
import { Stream, Writable } from 'stream'
workspace.test('check if account exists', async (test, { root }) => {
    test.log('todo')

    let pwd = exec('pwd', (error, stdout, stderr) => {
        console.log('pwd: ' + stdout)
    })

    // pwd.on('spawn', ()=>{console.log('pwd spawned')})
    // pwd.on('error', (err)=>{console.log(`pwd error: ${err}`)})
    // pwd.on('message', (msg)=>{console.log(`pwd message: ${msg}`)})
    // pwd.on('exit', (code, signal)=>{console.log(`pwd exit, code: ${code}, signal: ${signal}`)})
    // pwd.on('close', (code, signal)=>{console.log(`pwd exit, code: ${code}, signal: ${signal}`)})

    console.log('trying to run a js script with node...')

    let child = fork('child.js', ["world"], { stdio: 'pipe'});
    console.log('child node connected: ' + child.connected)
    child.on('spawn', ()=>{console.log("child node spawned")})
    child.on('error', (err)=>{console.log(`child node error: ${err}`)})

    child.on('exit', (code, signal)=>{console.log(`child node exit, code: ${code}, signal: ${signal}`)})
    child.on('close', (code, signal)=>{console.log(`child node closed, code: ${code}, signal: ${signal}`)})

    child.on('disconnect', ()=>{console.log('child node disconnected')})

    child.stderr.on('data', data =>{
        console.log(`stderr from child node: ${data}`)
    })

    child.stdout.on('data', data =>{
        console.log(`stdout from child node: ${data}`)
    })

    return;

    let p = fork("__tests__/hello.js", ["world"], { stdio: 'pipe' })
    console.log(`connected: ${p.connected}`)

    p.on('spawn', () => {
        console.log('spawn on spawn');
    });

    p.on('error', function (err) {
        console.log(`Error in child process: ${err}`)
    });

    //p.stdout.pipe(process.stdout)

    p.stdout.on('data', (data) => {
        console.log(`data from stdout of the child process: ${data}`)
    })

    p.stderr.on('data', (err) => {
        console.log(`error data from child process: ${err}`)
    })

    p.stdin.on('data', (data) => {
        console.log(`data from stdin of the child process: ${data}`)
    })

    p.on('exit', (code) => {
        console.log(`child process finished, code: ${code}`)
    })
})