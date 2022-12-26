import React, {useEffect, useState} from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";
// import uuid from "uuid/v4";

// const initialExpenses = [
//     {id : 1,charge:"rent",amount:1300},
//     {id : 2,charge:"car payment",amount:600},
//     {id : 3,charge:"credit card bill",amount:100},
// ]

const initialExpenses = localStorage.getItem("expenses")
    ? JSON.parse(localStorage.getItem("expenses"))
    : [];

function App(){
    // state values
    // all expenses,add expenses
    const[expenses,setExpenses] = useState(initialExpenses);
    // single expense
    const [charge,setCharge]=useState(" ")
    // single amount
    const [amount, setAmount] = useState(" ")
    // alert
    const[alert,setAlert]=useState({show:false});
    // edit
    const [edit,setEdit]=useState(false)
    // edit item
    const [id,setId]=useState(0)
    // use effect
    useEffect(()=>{
        localStorage.setItem('expenses',JSON.stringify(expenses),[expenses])
    })
    // functionality

    // handle charge
    const handleCharge=e=>{
        setCharge(e.target.value)
    }
    // handle amount
    const handleAmount = e => {
        setAmount(e.target.value)
    }
    // handle alert
    const handleAlert=({type,text})=>{
        setAlert({show:true,type,text});
        setTimeout(() => {
            setAlert({show:false})
        },4000);
    }
    // handle submit
    const handleSubmit=e=>{
        e.preventDefault();
        if(charge!=='' && amount>0){
            if(edit){
                let tempExpenses=expenses.map(item=>{
                    return item.id===id?{...item,charge,amount}:item
                })
                setExpenses(tempExpenses);
                setEdit(false);
                handleAlert({ type: 'success', text: 'Item edited' })
            }
            else{
                const singleExpense = { id: 1, charge, amount }
                setExpenses([...expenses, singleExpense]);
                handleAlert({ type: 'success', text: 'Item added' })
            }
            setCharge("");
            setAmount("");
        }
        else{
            handleAlert({
                type:'danger',
                text:"charge can't be empty value has to be bigger than zero"
            })
            
        }
    }
    // clear all items
    const clearItems=() =>{
        setExpenses([]);
        handleAlert({ type: 'danger', text: "all items deleted" })
    };
    // handle delete
    const handleDelete=(id)=>{
        let tempExpenses=expenses.filter(item=>item.id!==id);
        setExpenses(tempExpenses)
        handleAlert({type:'danger',text:'item deleted'})
    }
    // handle edit
    const handleEdit= (id) => {
        let expense=expenses.find(item=>item.id===id);
        let {charge,amount}=expense;
        setCharge(charge);
        setAmount(amount);
        setEdit(true);
        setId(id);
    }
    return (
        <>
            {alert.show && 
            <Alert type={alert.type} 
            text={alert.text} />}
            
            <h1>Budget Calculator</h1>
            <main className="App">
                <ExpenseForm 
                    handleSubmit={handleSubmit}
                    charge={charge}
                    handleCharge={handleCharge}
                    amount={amount}
                    handleAmount={handleAmount}
                    edit={edit}
                />
                <ExpenseList 
                    expenses={expenses} 
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    clearItems={clearItems}
                />
            </main>
            <h1>Total spending : <span className="Total">
                ${expenses.reduce((acc,curr)=>{
                    return (acc+=parseInt(curr.amount));
                },0)}
            </span>
            </h1>
        </> 
    )
};

export default App;