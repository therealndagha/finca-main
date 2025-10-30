
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customer-routes.js';
import staffRoutes from './routes/staff-routes.js';
import branchRoutes from './routes/branch-routes.js';
import groupRoutes from './routes/group-routes.js';
import loanProductRoutes from './routes/loanProducts-routes.js';
import loanApplicationRoutes from './routes/loanApplication-routes.js';
import rolesRoutes from './routes/role-routes.js';
import loanRoutes from './routes/loan-routes.js';
import repaymentRouter from "./routes/repayment-routes.js";
import collateralRoutes from './routes/collateralRoutes.js';
import guarantorRoutes from './routes/guarantorRoutes.js';
import loanDisbursementRoutes from './routes/loanDisbursementRoutes.js';
import complaintsRoutes from './routes/complaintsRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodsRoutes.js';
import loanWriteOffRoutes from './routes/loanWriteOffRoutes.js';
import loanInsuranceRoutes from './routes/loanInsuranceRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
     origin: 'http://localhost:5173', 
    credentials: true}  
));
app.use(cookieParser());

app.get('/api', (req, res)=>{
    res.status(200).json({
        success: true,
        message: 'API is running...'
    })
});

app.use('/api/branch', branchRoutes)
app.use('/api/customers',customerRoutes );
app.use('/api/staff', staffRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/loanproducts', loanProductRoutes);
app.use('/api/loanapplications', loanApplicationRoutes);
app.use('/api/role', rolesRoutes);
app.use('/api/loans', loanRoutes);
app.use("/api/repayments", repaymentRouter);
app.use("/api/collateral", collateralRoutes);
app.use('/api/guarantor', guarantorRoutes);
app.use('/api/loandisbursements', loanDisbursementRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/paymentmethods', paymentMethodRoutes);
app.use('/api/loanwriteoff', loanWriteOffRoutes);
app.use('/api/loaninsurance', loanInsuranceRoutes);

app.listen(PORT, ()=>console.log(`server is listening on port: ${PORT}`));