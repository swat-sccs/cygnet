import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from '../../db';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM student_data');
        return NextResponse.json({ response: rows });
    } catch (e) {
        return NextResponse.json({ response: e });
    }

}