export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import { queryDb } from '../../queryDb';
import { StudentInfo } from "@/app/page";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const raw = await queryDb("SELECT * FROM student_data")
        // const data:Object[]= Array.isArray(raw) ? raw.slice(0, 50) : [];
        // console.log(raw)
        // const data:StudentInfo | [] = [];
        return NextResponse.json({ response: raw });
    } catch (e) {
        return NextResponse.json({ response: e });
    }
}
