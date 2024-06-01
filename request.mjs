import https from 'https'

const request = https.get(
   'https://www.google.com',
    (response) => {
        console.log(`statusCode: ${response.statusCode}`)
        console.log(response.headers)

        response.on('data', (chunk) => {
            console.log('This is a chunk: \n')
            console.log(chunk.toString())
        })
    }
)

request.on('error', (err) => {
    console.log(err)
})

request.end()