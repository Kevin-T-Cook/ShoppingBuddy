import {Route, Routes} from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import "./App.css";
import Products from "./pages/Products";
import SinglePurchase from "./pages/SinglePurchase";
import SingleProduct from "./pages/SIngleProduct";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Posts from "./pages/Posts";
import UserPosts from "./pages/UserPosts";
import {useGetPostsQuery, useGetProductsQuery} from "../../server/api";

function App() {

    const me = useSelector((state) => state.auth.credentials.user);
    const data = useSelector(state=>state.data);
    const posts = useGetPostsQuery();
    const products = useGetProductsQuery();

    const [load,setLoad]=useState(true)

    useEffect(()=>{
        setLoad(posts.isLoading||products.isLoading)
    }, [posts, products])

    const guestRouter = (
        <Routes>
            <Route path="/*" element={<AuthForm/>}/>
        </Routes>
    );
    const userRouter = (
        <Routes>
            <Route index element={<Products/>}/>
            <Route path={"/posts"} element={<Posts/>}/>
            <Route path={"/purchase/:id"} element={<SinglePurchase/>}/>
            <Route path={"/product/:id"} element={<SingleProduct/>}/>
            <Route path={"/user"} element={<UserPosts/>}/>
        </Routes>
    );

    const loggedIn = me.userId;
    return load? <h1>Loading Data</h1>:loggedIn !== null ? userRouter : guestRouter;
}

export default App;
