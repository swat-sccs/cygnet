import { queryDb } from './app/queryDb';
export default async function getData() {

    // doesn't work?
    const q = 'SELECT * FROM student_data'
    const data = queryDb(q);
    return (
        <>
            {data}
        </>
    )
}
