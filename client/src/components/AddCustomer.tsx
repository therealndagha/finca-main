import { useState } from "react";
import type { AddCustomerProps, CustomerFormData } from "../types/user-defined-types";
import { FaRegAddressCard } from "react-icons/fa";


export default function AddCustomer({setTriggerCustomerListRefresh}:AddCustomerProps ){
    
    const [customerFormData, setCustomerFormData] = useState<CustomerFormData>({
        f_name: "",
        l_name: "",
        national_id_no: "",
        email: "",
        phone_no: "",
        customer_type: "individual",
        address:"",
        branch_id:1});

    const [regError, setRegError]=useState<string | null>(null);    

    async function handleOnChange(event:React.ChangeEvent<HTMLInputElement>){
             const {name, value} = event.target;
             setCustomerFormData({
                ...customerFormData, [name]: value
             })
    };   

    async function handleSubmit(event:React.FormEvent<HTMLFormElement>){

        event.preventDefault();
        
        try {

            const apiResponse = await fetch("http://localhost:3000/api/customer", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(customerFormData)
            });
     
            const result = await apiResponse.json();
            if(result.success){
                setRegError(result.message)   
            }
            setRegError(result.message)           
        } catch (error) {
            console.log('some error occured while trying to register customer')
            if (error instanceof Error) {
                setRegError(error.message);
            } else {
                setRegError('An unknown error occurred while trying to register customer');
            }
        } finally{
            setTriggerCustomerListRefresh(true)
        }
        
    };

    return (
        <div className="flex flex-col items-center justify-center">
               <form onSubmit={handleSubmit} className="flex flex-col space-y-5 shadow-xl shadow-blue-950 rounded-md w-md">
                     <div className="flex space-x-2 items-center text-3xl   bg-blue-950 text-white py-10 pl-5">
                        <div>
                            <FaRegAddressCard/>
                        </div>
                        <h1 className="font-inter font-bold">Register new customer</h1>
                     </div>
                     <div className="py-10 pl-5 space-y-5">
                           <div className="flex space-x-10 items-center ">
                         <label htmlFor="f_name" className="text-lg font-roboto text-blue-950 font-bold">Firstname:</label>
                         <input type="text" name="f_name" onChange={handleOnChange} value={customerFormData.f_name} className="outline-none border-b-2 font-bold border-blue-950 mb-4" required/>   
                     </div> 
                     <div className="flex space-x-10 items-center">
                         <label htmlFor="l_name" className="text-lg font-roboto text-blue-950 font-bold">Lastname:</label>
                         <input type="text"  name="l_name" onChange={handleOnChange} value={customerFormData.l_name} className="outline-none border-b-2 font-bold border-blue-950 mb-4" required/>   
                     </div> 
                     <div className="flex space-x-10 items-center">
                         <label htmlFor="phone_no" className="text-lg font-roboto text-blue-950 font-bold">Phone Number:</label>
                         <input type="text" name="phone_no" onChange={handleOnChange} value={customerFormData.phone_no} className="outline-none border-b-2 font-bold border-blue-950 mb-4" required/>   
                     </div> 
                     <div className="flex space-x-10 items-center">
                         <label htmlFor="email" className="text-lg font-roboto text-blue-950 font-bold">Email:</label>
                         <input type="email" name="email" onChange={handleOnChange} value={customerFormData.email} className="outline-none border-b-2 font-bold border-blue-950 mb-4" />   
                     </div> 
                     <div className="flex space-x-10 items-center">
                         <label htmlFor="national_id_no" className="text-lg font-roboto text-blue-950 font-bold">National ID No:</label>
                         <input type="text" name="national_id_no" onChange={handleOnChange} value={customerFormData.national_id_no} className="outline-none border-b-2 font-bold border-blue-950 mb-4" required/>   
                     </div> 
                     <div className="flex space-x-10 items-center">
                         <label htmlFor="address" className="text-lg font-roboto text-blue-950 font-bold">Address:</label>
                         <input type="text" name="address"  onChange={handleOnChange} value={customerFormData.address} className="outline-none border-b-2 font-bold border-blue-950 mb-4" required/>   
                     </div> 
                     <div className="flex space-x-10 items-center">
                         <label htmlFor="customer_type" className="text-lg font-roboto text-blue-950 mb-4 font-bold">Customer Type:</label>
                         <input type="text" name="customer_type" onChange={handleOnChange} value={customerFormData.customer_type} className="outline-none border-b-2 font-bold border-blue-950 mb-4" required/>   
                     </div> 
                     <div className="flex space-x-10 items-center">
                         <label htmlFor="branch_id" className="text-lg font-roboto text-blue-950 font-bold">Branch ID:</label>
                         <input type="text" name="branch_id" onChange={handleOnChange} value={customerFormData.branch_id} className="outline-none border-b-2 font-bold border-blue-950 mb-4" required/>   
                     </div>
                     </div>
                     <div className="flex items-center justify-center">
                        {
                            regError &&  <p className="text-red-600 text-lg">{regError}</p>  
                        }                       
                     </div>
                     <div className="flex items-center justify-center">
                         <button type="submit" className="bg-blue-950 hover:bg-blue-800 text-white px-2 py-2 font-open-sans">Register</button>
                     </div>    
               </form>
        </div>
    )
}