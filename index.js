import {faker} from '@faker-js/faker'
import client from './connect.js'


let count = 1000

const fakeData = async () => {
    for ( let i = 0; i < count; i++ ) {
        const blog = {
            title: faker.lorem.text(),
            description: faker.lorem.paragraph(),
            date: faker.date.past()
        }
        // console.log(blog)
        await client.index({
            index: 'blog',
            body: {
                ...blog
            }
        })
        console.log("blog--> ", i)
    }  
}

// fakeData()
