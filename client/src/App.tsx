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

// --- Import the new components (to be created soon)
import Collateral from "./components/Collateral";
import LoanWriteOff from "./components/LoanWriteOff";
import PaymentMethods from "./components/PaymentMethods";
import Guarantor from "./components/Guarantor";
import Complaints from "./components/Complaints";
import LoanInsurance from "./components/LoanInsurance";
import Statistics from "./components/Statistics";

export default function App() {
  return (
    <Routes>
      {/* Layout wraps all routes with sidebar and outlet */}
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

        {/* ✅ Additional routes (not in sidebar) */}
        <Route path="collateral" element={<Collateral />} />
        <Route path="loan-writeoff" element={<LoanWriteOff />} />
        <Route path="payment-methods" element={<PaymentMethods />} />
        <Route path="guarantor" element={<Guarantor />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="loan-insurance" element={<LoanInsurance />} />
        <Route path="/statistics" element={<Statistics/>}/>
      </Route>
    </Routes>
  );
}
