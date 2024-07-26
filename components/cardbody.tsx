import { StudentOverlay } from '@prisma/client';
import Card from './card';
import { use } from 'react';

interface CardBodyProps {
    filteredData: Promise<StudentOverlay[]> | undefined;
}

export default function CardBody(props: CardBodyProps) {
    const { filteredData } = props;
    if (filteredData) {
        return (
            <div className="max-w-screen-lg w-full md:mx-auto mt-4 mb-4 justify-center">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {
                        use(filteredData).map((item, index) => (
                            <div className="flex-col">
                                <Card key={index} {...item} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className="max-w-screen-lg w-full md:mx-auto mt-4 mb-4 justify-center">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                    <div className="flex-col gy-4">
                        <Card />
                    </div>
                </div>
            </div>
        )
    }
}

