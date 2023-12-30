import {useParams} from "react-router-dom";
import {useEditPurchaseMutation, useGetPurchaseByIdQuery} from "../reducers/api";
import {useEffect, useState} from "react";


function SinglePurchase() {

    const [form,setForm]=useState({
        date: new Date().toISOString(),
        description: "test description",
        amount: 2000
    })

    const params = useParams();

    const {data,isLoading}= useGetPurchaseByIdQuery(params.id)
    const [updatePurchase]=useEditPurchaseMutation();

    useEffect(()=>{
        if(data!==undefined){
            console.log(data)
            setForm(data)
        }
    }, [isLoading])

    const changeValue = key => event =>{
        setForm({
            ...form,
            [key]: key==="amount"?Number(event.target.value):event.target.value
        })
    }

    return (
        <>
            {isLoading? <h1>Loading...</h1>: data===null? <h1>No Purchase Found</h1>:
                <form onSubmit={(e)=>{e.preventDefault(); updatePurchase(form)}}>
                    <input onChange={changeValue("description")} type={"text"} value={form.description}/>
                    <input onChange={changeValue("amount")} type={"number"} value={form.amount}/>
                    <input type={"submit"} value={"SUBMIT"}/>

                </form>}
        </>
    )
}

export default SinglePurchase;