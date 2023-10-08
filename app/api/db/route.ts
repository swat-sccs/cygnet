import { NextRequest, NextResponse } from "next/server";
import { queryDb } from '../../queryDb';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const data = await queryDb("SELECT * FROM student_data");
        return NextResponse.json({ response: data });
    } catch (e) {
        return NextResponse.json({ response: e });
    }
}

