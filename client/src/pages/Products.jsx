import { useDeleteProductMutation, useAddProductMutation} from "../reducers/api";

import {useSelector} from "react-redux";

function Products() {
    const products = useSelector(state=>state.data.products);
    const [deleteProduct] = useDeleteProductMutation();
    const [addProduct]= useAddProductMutation();

    const onDelete = async (id)=>{
        await  deleteProduct(id).then(()=>{
            console.log("delete")
        }).catch(()=>{
            console.log("error")
        })
    }

    const onSubmit = async()=>{
        await addProduct({
            name:"undies",
            price: 25
        }).then(()=>{
            console.log("added")
        }).catch(()=>{
            console.log("error")
        })
    }

    return (
        <>
            <button onClick={onSubmit}>Add Product</button>
            {products.length===0? <h1>No Products Listed</h1>:products.map((i)=>
                <div key={i.id}>
                    <h1 >{i.name}</h1>
                    <h3>$ {i.price}</h3>
                    <button onClick={()=>onDelete(i.id)}>Delete</button>
                </div>

            )}

        </>
    );
}

export default Products;
