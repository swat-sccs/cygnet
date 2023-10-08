//bad (for now)
import { queryDb } from './app/queryDb';
export default async function getData() {

    const q = 'SELECT * FROM student_data'
    const data = await queryDb(q);
    console.log(data);
    return (
        <>
            {data}
        </>
    )
}
