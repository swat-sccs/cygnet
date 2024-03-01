import { StudentInfo } from '@/app/page';
import Card from './card';
import { Suspense, use } from 'react';

interface CardBodyProps {
    filteredData: Promise<StudentInfo[]> | undefined;
}

export default function CardBody(props: CardBodyProps) {
    const { filteredData } = props;
    if (filteredData) {
        return (
            <div className="grid-make margin-cardbody">
                {
                    use(filteredData).map((item, index) => (
                        <Suspense fallback={<Card key={index} />}>
                            <Card key={index} {...item} />
                        </Suspense>
                    ))
                }
            </div>
        )
    } else {
        return (
            <div className="grid-make margin-cardbody">
                <Card key={1} />
                <Card key={2} />
                <Card key={3} />
                <Card key={4} />
                <Card key={5} />
                <Card key={6} />
                <Card key={7} />
                <Card key={8} />
            </div>
        )
    }
}

