

export type Branch ={
    branch_id: number,
    branch_name: string,
    location: string,
    phone_no: string,
}


export type Customer = {
    customer_id: number,
    f_name: string,
    l_name: string,
    address:string,
    phone_no: string,
    email:string,
    branch_id: string
}

export type Group = {
    group_id: number,
    group_name: string,
    group_type: string,
    phone_no: string,
    address:string,
    branch_id: string
}

export type Staff = {
    staff_id: number,
    f_name: string,
    l_name: string,
    email: string,
    role_name: string,
    address: string,
    phone_no: string
}

export type Loan_Product = {
    product_id : number,
    product_name: string,
    interest_rate: number,
    max_amount:number,
    min_amount:number,
    tenure_months:number,
    description:string
}


export type CustomerFormData = {
    f_name: string,
    l_name: string,
    national_id_no: string,
    customer_type:string,
    phone_no:string,
    address:string,
    email:string,
    branch_id:number
}

export type AddCustomerProps = {
  setTriggerCustomerListRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};
