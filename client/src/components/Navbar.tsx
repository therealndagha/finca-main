import { useNavigate } from "react-router-dom";
import { navLinks } from "../utilis/NavLinks";
import NavItemCart from "./NavItemCart";


export default function Navbar(){
    const navigate = useNavigate()
    return (
        <div className="flex flex-row justify-around my-5  items-center">
       <div>
          <img src="finca.webp" className="img-fluid w-40" onClick={()=>navigate('/')} />
       </div>
       <div className="flex flex-row space-x-10" >
            {
            navLinks.map((singleNavItem)=>(
              <NavItemCart key={singleNavItem.name} {...singleNavItem} />
            ))
          }
       </div>
     </div>
    )
}