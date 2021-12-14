const { fork, spawn, exec } = require('child_process')

exec('pwd', (error, stdout, stderr) => {
    console.log('exec stdout: ' + stdout)
})
// exec('node child.js world', (error, stdout, stderr) => {
//     if (error) {
//         console.log(error)
//         return;
//     }
//     console.log(stderr)
//     console.log('exec stdout: ' + stdout)
// })

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
