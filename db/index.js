import { MongoClient } from "mongodb";

const URI = process.env.NEXT_PUBLIC_MONGODB_URI
const options = {}

if(!URI) throw new Error("Can't find URI in .env.local")

let client = new MongoClient(URI, options)
let clientPromice = client.connect()

export default clientPromice