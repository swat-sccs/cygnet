import chevron from '../public/imgs/chevron.svg';
import Image from 'next/image';

interface FilterProps {
    filterOn: boolean;
}

export default function Filter(props: FilterProps) {
    return(
    <div className={props.filterOn?"position-absolute filterwindow":"position-absolute invisible"}>
        <p className="h4 font-semibold">Filters</p>
        <div className="filterSelect shadow d-inline-block position-relative">
            <select>
                <option disabled selected>Dorms</option>
                <option>a dorm</option>
            </select>
            <Image className="chevron-sm position-absolute" src = {chevron} alt="" />
        </div>
        <div className="filterSelect shadow d-inline-block position-relative">
            <select>
                <option disabled selected>Class Year</option>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
                <option>2026</option>
            </select>
            <Image className="chevron-sm position-absolute" src = {chevron} alt="" />
        </div>
        <button className="filterButton shadow">Clear</button>
    </div>
    )
}