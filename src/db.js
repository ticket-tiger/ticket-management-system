import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://Shelby:<password>@cluster0.yiifk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// async function run() {
//     try {
//         await client.connect()

//         const database = client.db("sample_mflix")
//         const movies = database.collection("movies")

//         // Query for a movie that has the title 'The Room'
//         const query = { title: "The Room" }

//         const options = {
//             // sort matched documents in descending order 
//         }
//     }
// }

client.connect(err => {
    const collection = client.db("test").collection("devices")
    // perform actions on the collection object
    client.close()
})