import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://MediQueue:7RCEYV0gdmdPHAJK@cluster0.tvp63og.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

// 🌟 ১. সব টিউটর ডাটাবেজ থেকে গেট (GET) করার জন্য এপিআই
export async function GET() {
  try {
    await client.connect();
    const db = client.db("mediQueueDB");
    const tutorsCollection = db.collection("tutors");

    // সব টিউটর ডেটা লেটেস্ট ডেট অনুযায়ী সর্ট করে নিয়ে আসা
    const tutors = await tutorsCollection.find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(tutors, { status: 200 });
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json({ error: "Failed to fetch tutors" }, { status: 500 });
  }
}

// 🌟 ২. আপনার আগের POST এপিআই (টিউটর এড করার জন্য)
export async function POST(req) {
  try {
    // সেশন চেক করার অংশ (যদি Better-Auth ইমপোর্ট করা থাকে)
    // const session = await auth.api.getSession({ headers: req.headers });
    
    const body = await req.json();
    await client.connect();
    const db = client.db("mediQueueDB");
    const tutorsCollection = db.collection("tutors");

    const newTutor = {
      ...body,
      hourlyFee: Number(body.hourlyFee),
      totalSlot: Number(body.totalSlot),
      createdAt: new Date()
    };

    const result = await tutorsCollection.insertOne(newTutor);
    return NextResponse.json({ success: true, message: "Tutor added!", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database Connection Failed!" }, { status: 500 });
  }
}