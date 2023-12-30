import {useParams} from "react-router-dom";
import { useEditProductMutation, useGetProductByIdQuery} from "../reducers/api";
import {useEffect, useState} from "react";

function SingleProduct() {
    const params = useParams()
    const [price,setPrice]=useState(10);

    const {data, isLoading} = useGetProductByIdQuery(params.id);
    const [editProduct] = useEditProductMutation();

    useEffect(()=>{
        if(data!==undefined){
            setPrice(Number(data.price))
        }
    }, [isLoading])

    const submit =()=>{
        editProduct({
            id:data.id,
            name:data.name,
            price:price
        })
        location.reload();
    }

    return (
        <> {isLoading ? <h1>loading....</h1> :
            <div>
                <h1>{data.name}</h1>
                <h3>{data.price}</h3>
                <button onClick={()=>setPrice(price+5)}>Add 5</button>
                <button onClick={()=>setPrice(price-5)}>Reduce by 5</button>
                {price}
                <button onClick={submit}>Submit New Price</button>
            </div>
        }
        </>

    )
}

export default SingleProduct;