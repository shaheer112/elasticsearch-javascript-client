import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import client from './connect.js'


const app = express()
config()
const port = process.env.PORT
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', (req, res) => {
    return res.json({
        data: 'hello, this is elasticsearch'
    })
})

app.get('/search', async (req, res) => {
    const body = await client.search({
        index: 'blog',
        body: {
            query: {
                match_all: {},
            },
        },
    })
    return res.json({data: body})
})
// all mathed data
app.get('/search/all', async (req, res) => {
    const body = await client.search({
        index: 'blog',
        body: {
            query: {
                match_all: {},
            },
        },
    })
    return res.json({data: body})
})
// full text search - it matches both uppercase and lowercase
// www.elastic.co/guide/en/elasticsearch/reference/7.9/query-dsl-match-query.html
app.get('/search/full-text', async (req, res) => {
    const text = req.query.text || ""
    const body = await client.search({
        index: 'blog',
        body: {
            query: {
                match: {
                    title: {
                        query: text
                    },
                },
            },
        },
    })
    return res.json({data: body})
})
// partial text search
app.get('/search/partial-text', async (req, res) => {
    const text = req.query.text || ""
    const body = await client.search({
        index: 'blog',
        body: {
            query: { 
                wildcard: { 
                    title: `*${text}*`
                }
            }
        }
    })
    return res.json({data: body})
})
// multiple field search- and query
app.get('/search/multiple-field/and', async (req, res) => {
    const text = req.query.text || ""
    const body = await client.search({
        index: 'blog',
        body: {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                title: text
                            }
                        },
                        {
                            match: {
                                description: text
                            }
                        }
                    ]
                }
            },
        },
    })
    return res.json({data: body})
})

app.get('/search/multiple-field/or', async (req, res) => {
    const text = req.query.text || ""
    const body = await client.search({
        index: 'blog',
        body: {
            query: {
                multi_match: {
                    query: text,
                    fields: ['title', 'description']
                }
            },
        },
    })
    return res.json({data: body})
})
// paginating first 25 records
app.get('/search/pagination', async (req, res) => {
    const body = await client.search({
        index: 'blog',
        body: {
            query: {
                match_all: {},
            },
            from: 0,
            size: 100
        },
    })
    return res.json({data: body})
})


app.listen(port, () => console.log(`server is running on port ${port}`))