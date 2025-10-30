
import type { Loan_Product } from "../types/user-defined-types"
import { useNavigate } from 'react-router-dom';


const SingleLoanProductCard = ({description, interest_rate, max_amount, min_amount, product_id, product_name, tenure_months}: Loan_Product) => {
  const navigate = useNavigate();

  return (
                   <div className="p-4 bg-gray-100 rounded-lg  shadow space-y-2">
                     <h2 className="text-xl font-bold flex items-center space-x-2">{product_name}</h2>
                     <p className=" flex items-center space-x-2 text-slate-600 font-open-sans">{description}</p>
                     <p className="text-slate-700 font-open-sans">Min Amount: MWK{min_amount}  Max Amount: MWK{max_amount}</p>
                     <p className="text-slate-700 font-open-sans">Tenure Months: {tenure_months}</p>
                     <p className="text-slate-800 font-open-sans">{interest_rate} interest</p>
                     <button onClick={()=>navigate(`/loans/apply/${product_id}`)} className='px-2 py-2 rounded-md bg-blue-950 text-white hover:bg-blue-800'>Apply</button>
                   </div>
  )
}

export default SingleLoanProductCard