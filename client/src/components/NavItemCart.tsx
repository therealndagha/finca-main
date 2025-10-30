import { useNavigate } from "react-router-dom"
import type { NavObj } from "../utilis/NavLinks"



const NavItemCart = ({name, path}: NavObj) => {
    const navigate = useNavigate()
  return (
    <div>
        <h2 className="text-lg text-slate-600 font-roboto hover:text-red-500">
           <button onClick={()=>navigate(path)}>{name}</button>
        </h2>
    </div>
  )
}

export default NavItemCart