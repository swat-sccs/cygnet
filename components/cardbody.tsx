import { StudentInfo } from '@/components/pagebody';
import Card from './card';
import { use } from 'react';

interface CardBodyProps {
    filteredData: Promise<StudentInfo[]> | undefined;
}

export default function CardBody(props: CardBodyProps) {
    const { filteredData } = props;
    if (filteredData) {
        return (
            <div className="container text-center">
            <div className="row justify-content-md-center">
                {
                    use(filteredData).map((item, index) => (
                        <Card key={index} {...item} />
                    ))
                }
            </div>
            </div>
        )
    } else {
        return (
            <div className="container text-center">
            <div className="row justify-content-md-center">
                <Card key={1} />
                <Card key={2} />
                <Card key={3} />
                <Card key={4} />
                <Card key={5} />
                <Card key={6} />
                <Card key={7} />
                <Card key={8} />
            </div>
            </div>
        )
    }
}

