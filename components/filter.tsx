import chevron from '../public/imgs/chevron.svg';
import Image from 'next/image';

interface FilterProps {
    filterOn: boolean;
}

export default function Filter(props: FilterProps) {
    return(
    <div className={props.filterOn?"position-absolute filterwindow":"position-absolute opacity-0 invisible"}>
        <p className="h4 font-semibold">Filters</p>
        <div className="filterSelect shadow-lg d-inline-block position-relative">
            <select>
                <option disabled selected>Dorms</option>
                <option>Alice Paul</option>
                <option>Dana</option>
                <option>Danawell</option>
                <option>David Kemp</option>
                <option>Hallowell</option>
                <option>Kyle</option>
                <option>Mertz</option>
                <option>Mary Lyons</option>
                <option>Palmer</option>
                <option>Pittenger</option>
                <option>PPR Appts</option>
                <option>Roberts</option>
                <option>Wharton</option>
                <option>Willets</option>
                <option>Woolman</option>
                <option>Worth</option>
            </select>
            <Image className="chevron-sm position-absolute" src = {chevron} alt="" />
        </div>
        <div className="filterSelect shadow-lg d-inline-block position-relative">
            <select>
                <option disabled selected>Class Year</option>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
                <option>2026</option>
            </select>
            <Image className="chevron-sm position-absolute" src = {chevron} alt="" />
        </div>
        <button className="filterButton shadow">Reset</button>
    </div>
    )
}