import { StudentOverlay } from '@prisma/client';
import Card from './card';
import { use } from 'react';

interface CardBodyProps {
    filteredData: Promise<StudentOverlay[]> | undefined;
}

const wrapClass = "max-w-5xl w-full mx-auto px-4 sm:px-6 mt-8";
const gridClass = "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

export default function CardBody(props: CardBodyProps) {
    const { filteredData } = props;

    if (filteredData) {
        const items = use(filteredData).filter((i: StudentOverlay) => i.showProfile);
        const n = items.length;

        return (
            <div className={wrapClass}>
                <div className="mb-3 text-sm text-fg-3">
                    {n} {n === 1 ? "result" : "results"}
                </div>
                {n === 0 ? (
                    <div className="py-16 text-center">
                        <p className="font-medium text-fg">No students found</p>
                        <p className="mt-1 text-sm text-fg-2">Try a different spelling or clear your filters.</p>
                    </div>
                ) : (
                    <div className={gridClass}>
                        {items.map((item: StudentOverlay) => (
                            <Card key={item.uid} {...item} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={wrapClass}>
            <div className="mb-3 text-sm text-fg-3">Searching…</div>
            <div className={gridClass}>
                {Array.from({ length: 8 }, (_, i) => (
                    <Card key={i} />
                ))}
            </div>
        </div>
    )
}
