import Card from './card'
import { Data } from './card'
interface CardBodyProps {
  filteredData: Data[]; 
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
