import Card from './card'
import data from '../data/data.json'

export default function CardBody() {
  return (
    <div className="grid-make margin-cardbody">
      {
        data.map((item, index) => <Card key = {index} {...item} />)
      }
    </div>
  )
}
