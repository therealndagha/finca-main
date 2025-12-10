// src/components/Home.tsx
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Briefcase,
  FileText,
  Group,
  CreditCard,
  ShieldCheck,
  Coins,
  HandCoins,
  UserCheck,
  MessageSquareWarning,
  Wallet,
} from "lucide-react";

import { navLinks } from "../utilis/NavLinks";
import NavItemCart from "./NavItemCart";

export default function Home() {
  const dashboardItems = [
    { name: "Branches", icon: <Building2 className="w-8 h-8 text-blue-500" />, path: "/branches" },
    { name: "Customers", icon: <Users className="w-8 h-8 text-green-500" />, path: "/customers" },
    { name: "Staff", icon: <Briefcase className="w-8 h-8 text-indigo-500" />, path: "/staff" },
    { name: "Groups", icon: <Group className="w-8 h-8 text-purple-500" />, path: "/groups" },
    { name: "Loans", icon: <CreditCard className="w-8 h-8 text-yellow-500" />, path: "/loans" },
    { name: "Products", icon: <Coins className="w-8 h-8 text-amber-600" />, path: "/products" },
    { name: "Loan Applications", icon: <FileText className="w-8 h-8 text-pink-500" />, path: "/apply" },
    { name: "Repayments", icon: <HandCoins className="w-8 h-8 text-orange-500" />, path: "/repayments" },
    { name: "Roles", icon: <ShieldCheck className="w-8 h-8 text-cyan-500" />, path: "/roles" },
    { name: "Collateral", icon: <Wallet className="w-8 h-8 text-lime-600" />, path: "/collateral" },
    { name: "Loan Write-Off", icon: <FileText className="w-8 h-8 text-rose-600" />, path: "/loan-writeoff" },
    { name: "Payment Methods", icon: <CreditCard className="w-8 h-8 text-sky-600" />, path: "/payment-methods" },
    { name: "Guarantor", icon: <UserCheck className="w-8 h-8 text-teal-600" />, path: "/guarantor" },
    { name: "Complaints", icon: <MessageSquareWarning className="w-8 h-8 text-red-500" />, path: "/complaints" },
    { name: "Loan Insurance", icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />, path: "/loan-insurance" },
    {name: "Statistics", icon:<FileText className="w-8 h-8 text-rose-600"/>, path:"/statistics"}
  ];
  const navigate = useNavigate();
  return (
     <div>
         <div className="flex flex-row justify-around my-5  items-center bg-blue-950 text-white py-2">
       <div>
          <img src="finca.webp" className="img-fluid w-40" onClick={()=>navigate('/')} />
       </div>
       <div className="flex flex-row space-x-10" >
            {
            navLinks.map((singleNavItem)=>(
                    <div>
                         <h2 className="text-lg text-white font-roboto hover:text-slate-400">
                             <button onClick={()=>navigate(singleNavItem.path)}>{singleNavItem.name}</button>
                         </h2>
                  </div>
            ))
          }
       </div>
     </div>
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to Your Dashboard
      </h1>
      <p className="text-gray-600 mb-10 text-lg">
        Manage branches, loans, customers, and more — all from one place.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dashboardItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="group bg-white shadow-md hover:shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 border border-gray-100 hover:border-blue-400 hover:scale-105"
          >
            <div className="mb-4">{item.icon}</div>
            <h2 className="text-gray-800 font-semibold text-lg group-hover:text-blue-600">
              {item.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
     </div>
  );
}
