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
            <div className="container">
                <div className="row flex">
                    {
                        use(filteredData).map((item, index) => (
                            <div className="col-6 col-md-4 col-lg-3 gy-4 flex-fill flex-grow-1 h-100">
                                <Card key={index} {...item} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 gy-4">
                        <Card />
                    </div>
                </div>
            </div>
        )
    }
}

