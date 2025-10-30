// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Branches from "./components/Branches";
import Customers from "./components/Customers";
import Staff from "./components/Staff";
import Loans from "./components/Loans";
import Groups from "./components/Groups";
import LoanApplications from "./components/LoanApplication";
import Roles from "./components/Roles";
import Products from "./components/Product";
import Repayments from "./components/Repayments";

export default function App() {
  return (
    <Routes>
      {/* Layout wraps all routes that share the sidebar */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="branches" element={<Branches />} />
        <Route path="customers" element={<Customers />} />
        <Route path="staff" element={<Staff />} />
        <Route path="loans" element={<Loans />} />
        <Route path="groups" element={<Groups />} />
        <Route path="products" element={<Products />} />
        <Route path="apply" element={<LoanApplications />} />
        <Route path="roles" element={<Roles />} />
        <Route path="repayments" element={<Repayments />} />
      </Route>
    </Routes>
  );
}
