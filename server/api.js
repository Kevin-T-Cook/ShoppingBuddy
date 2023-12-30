import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {createSlice} from "@reduxjs/toolkit";

const CREDENTIALS = "credentials";

// Define a service using a base URL and expected endpoints
export const storeApi = createApi({
    tagTypes:['purchases'],
    reducerPath: 'bigfredApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8081/',
        prepareHeaders: (headers, { getState }) => {
            console.log("prepareHeaders is running");

            const credentials = window.sessionStorage.getItem(CREDENTIALS);
            const parsedCredentials = JSON.parse(credentials || "{}");
            const token = parsedCredentials.token;
            console.log("token from reducer", token);
            if (token) {
                headers.set("Authorization", token);
            }
            console.log("token from session storage:", token);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPurchases : builder.query({
            query: ()=> 'api/purchases'
        }),
        getProducts: builder.query({
            query: ()=>'api/products'
        }),

        getPosts: builder.query({
          query: ()=> 'api/posts'
        }),

        getUserPosts: builder.query({
            query:(id)=>'api/posts/user/'+id
        }),

        getPurchaseById : builder.query({
            query: (id)=> 'api/purchases/'+id
        }),
        getProductById :builder.query({
            query: (id)=> 'api/products/'+id
        }),

        deletePurchase: builder.mutation({
            query: (id)=>({
                url:'api/purchases/'+id,
                method:"DELETE"
            })
        }),

        deletePost:builder.mutation({
            query:(id)=>({
                url:'api/posts/'+id,
                method:'DELETE'
            })
        }),

        deleteProduct: builder.mutation({
            query: (id)=>({
                url:'api/products/'+id,
                method: "DELETE"
            })
        }),
        addPurchase: builder.mutation({
            query: (body)=>({
                url:'api/purchases',
                method:"POST",
                body:body
            })
        }),
        addPost: builder.mutation({
            query:(body)=>({
                url:'api/posts',
                method:"POST",
                body:body
            })
        }),

        addProduct: builder.mutation({
            query: (body)=>({
                url:'api/products',
                method:"POST",
                body:body
            })
        }),
        editPurchase: builder.mutation({
            query(data){
                const {id, ...body}=data;
                return {
                    url: 'api/purchases/'+id,
                    method:"PUT",
                    body
                }
            }
        }),

        editProduct : builder.mutation({
            query(data){
                const {id, ...body}=data;
                return {
                    url: 'api/products/'+id,
                    method:"PUT",
                    body
                }
            }
        })

    }),
})

const cartSlice = createSlice({
    name:"cart",
    initialState:[],
    reducers:{},
    extraReducers:(builder)=>{
        builder.addMatcher(storeApi.endpoints.getOrder.matchFulfilled, (state,  {payload})=>{
            return payload.cartItems
        })

        builder.addMatcher(storeApi.endpoints.deleteCartItem.matchFulfilled, (state,  {payload})=>{

        })

        builder.addMatcher(storeApi.endpoints.addCartItem.matchFulfilled, (state,  {payload})=>{

        })
    }
})

const dataSlice = createSlice({
    name:"data",
    initialState:{
        posts:[],
        products:[]
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder.addMatcher(storeApi.endpoints.getPosts.matchFulfilled, (state, {payload})=>{
            return{
                ...state,
                posts: payload
            }
        })

        builder.addMatcher(storeApi.endpoints.getProducts.matchFulfilled, (state, {payload})=>{
            return{
                ...state,
                products: payload
            }
        })

        builder.addMatcher(storeApi.endpoints.deleteProduct.matchFulfilled, (state, {payload})=>{
            return {
                ...state,
                products: state.products.filter(i=>i.id!==payload.id)
            }

        })

        builder.addMatcher(storeApi.endpoints.addProduct.matchFulfilled, (state, {payload})=>{
            state.products.push(payload);
            return state;
        })
    }
})

export default dataSlice.reducer;





export const { useGetUserPostsQuery, useAddPostMutation, useDeletePostMutation, useGetPostsQuery, useEditProductMutation, useAddProductMutation, useDeleteProductMutation, useGetProductsQuery, useGetProductByIdQuery, useEditPurchaseMutation, useAddPurchaseMutation, useGetPurchasesQuery, useGetPurchaseByIdQuery, useDeletePurchaseMutation} = storeApi