import http from 'http'
import url from 'url'
import { fetchImageMetadata, createUser } from './services.mjs'
import jsonBody from 'body/json.js'
import formidable from 'formidable'


const server = http.createServer()
server.on('request', (req, res) => {
    console.log(req.method, req.url)
    const parsedUrl = url.parse(req.url, true)
    if (req.method === 'GET' && parsedUrl.pathname === '/metadata') {
        const { id } = parsedUrl.query;
        const metadata = fetchImageMetadata(id)
        console.log(req.headers)
        console.log(metadata)
        res.setHeader('Content-type', 'application/json')
        res.statusCode = 200
        const serializedJSON = JSON.stringify(metadata)
        res.write(serializedJSON)
        res.end()
    }
    else if (req.method === 'POST' && parsedUrl.pathname === '/users'){
        jsonBody(req, res, (err, body) => {
            if (err) {
                console.log(err)
            } else {
                createUser(body.username)
            }
        })
        res.setHeader('Content-type', 'application/json')
        res.statusCode = 201
        const serializedJSON = JSON.stringify({
            success: true
        })
        res.write(serializedJSON)
        res.end()
    } else if(req.method === 'POST', parsedUrl.pathname === '/upload') {
        const form = new formidable.IncomingForm({
            uploadDir: './',
            keepExtensions: true,
            multiples: true,
            maxFileSize: 5 * 1024 * 1024
        })
        form.parse(req)
            .on('fileBegin', (name, field) => {
                console.log('Our Upload has Started')
            })
            .on('file', (name, field) => {
                console.log('Field + file pair has been received')
            })
            .on('field', (name, value) => {
                console.log('Field Received: ')
            })
            .on('progress', (bytesReceived, bytesExpected) => {
                console.log(bytesReceived + ' / ' + bytesExpected)
            })
            .on('error', (err) => {
                console.log(err)
                req.resume();
            })
            .on('aborted', () => {
                console.log('Request aborted by user')
            })
            .on('end', () => {
                console.log('Done - request fully received')
                res.end('Success!!!!!!!')
            })
    } else {
        res.statusCode = 404
        res.setHeader('X-Powered-By', 'Node')
        res.end()
    }
})

server.listen(3000)