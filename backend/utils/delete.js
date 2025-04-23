import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MongoDB connection string from environment variables

if (!uri) {
    console.error("MongoDB connection string is not defined!");
    process.exit(1);
}

const client = new MongoClient(uri);

async function deleteAllMeetings() {
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Connected successfully!");

        const db = client.db("test"); // replace with your actual database name
        const meetings = db.collection("meetings");

        console.log("Deleting meetings...");
        const result = await meetings.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} meeting(s).`);

    } catch (err) {
        console.error("Error occurred while deleting meetings:", err);
    } finally {
        console.log("Closing connection...");
        await client.close();
        console.log("Connection closed.");
    }
}

// Execute the delete function
deleteAllMeetings()
    .then(() => {
        console.log("Script completed.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });