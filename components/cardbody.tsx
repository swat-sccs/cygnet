import { StudentInfo } from '@/app/page';
import Card from './card'
interface CardBodyProps {
  filteredData: StudentInfo[]; 
}

export default function CardBody(props: CardBodyProps) {
  const {filteredData} = props;
  return (
    <div className="grid-make margin-cardbody">
      {
        filteredData.map((item, index) => <Card key = {index} {...item} />)
      }
    </div>
  )
}
