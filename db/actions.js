'use server'

import clientPromice from "."
import { getServerSession } from "next-auth"
import { authOptions } from "@/configs/auth"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache";


let client
let db
let users
let session

async function init() {
    if (db) return
    try {
        client = await clientPromice
        db = await client.db('calendar')
        users = await db.collection('users')
        session = await getServerSession(authOptions)
    }
    catch {
        throw new Error("Can't connect to the database")
    }
}

export async function registerUser(data) {

    try {
        if (!users) await init()

        const user = await users.findOne({ email: data.email})
        if (user) {
            throw new Error("User are already have an account")
        }
        else {
            await users.insertOne({...data, events: []})
        }
    }
    catch(error) {
        return {error: error.message}
    }
}


export async function findUser(email) {

    try {
        if (!users) await init()

        const user = await users.findOne({ email: email})
        if (!user) {
            throw new Error("Can't find user with such email")
        }
        else {
            return user
        }
    }
    catch(error) {
        return {error: error.message}
    }
}

export async function getEvents() {
    try {
        if (!users) await init()

        const user = await users.findOne({"_id": new ObjectId(session?.user._id)})
        if (!user) {
            throw new Error("Can't find user with such id")
        }
        else {
            return user?.events
        }
    }
    catch(error) {
        return {error: error.message}
    }
}

export async function addEvent(data) {
    try {
        if (!users) await init()

        const filter = {"_id": new ObjectId(session?.user._id)}
        const update = { $push: {events: { ...data }}}
        await users.updateOne(filter, update)
        revalidatePath('/')
    }
    catch(error) {
        return {error: error.message}
    }
}

export async function updateEvent(data) {
    try {
        if (!users) await init()

        const filter = {"_id": new ObjectId(session?.user._id), "events.id": data.id}
        const update = { $set: {"events.$": data}}
        await users.updateOne(filter, update)
        revalidatePath('/')
    }
    catch(error) {
        return {error: error.message}
    }
}

export async function deleteEvent(eventId) {
    try {
        if (!users) await init()

        const filter = {"_id": new ObjectId(session?.user._id)}
        const update = { $pull: {events: {id: eventId}}}
        await users.updateOne(filter, update)
        revalidatePath('/')
    }
    catch(error) {
        return {error: error.message}
    }
}
