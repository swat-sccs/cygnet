import insta from '../public/imgs/insta.svg';
import Image from 'next/image';

export default function Nav() {
  return (
  <div className="bg-white shadow-sm mont position-fixed w-full z-max">
    <ul className="nav container">
      <li className="mr-auto">
        <p className="play h1 mt-2">CYGNET<span className="h4 grad"> by SCCS</span></p>
      </li>
      <li className="nav-item my-auto ml-a pt-3 h5">
        <a href="https://www.sccs.swarthmore.edu/docs" target="_blank" className="text-decoration-none text-black">
          <p>About</p>
        </a>
      </li>
      <li className="nav-item my-auto pt-3 h5 pad">
        <p>Settings</p>
      </li>
      <li className="nav-item my-auto">
        <a href="https://www.instagram.com/swatsccs/" target="_blank">
        <Image src={insta} alt="insta" className="insta-size" />
        </a>
      </li>
    </ul>  
  </div>
  )
}
