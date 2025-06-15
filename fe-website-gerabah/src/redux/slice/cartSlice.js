import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState: {
        // data: [],
        data: JSON.parse(localStorage.getItem("cart")) || []
    },
    reducers:{

        // add data to localstorage
        addToCart:(state, action) => {
            const itemAddCart = state.data.find(item => item.id === action.payload.id)
            if(itemAddCart){
                itemAddCart.qty++
                return
            }else{
                state.data.push(action.payload)
            }
                localStorage.setItem("cart", JSON.stringify(state.data)); 
        },
        // to minus products from cart
        decreesItem: (state, action)=> {
            const itemAddCart = state.data.find(item => item.id === action.payload.id);
            if(itemAddCart){
                if(itemAddCart.qty > 1){
                    itemAddCart.qty--;
                }else{
                    state.data = state.data.filter(item => item.id != action.payload.id);
                    localStorage.setItem("cart",JSON.stringify(state.data))
                }
            }
        },
        // to add products to cart
        increesItem: (state, action) => {
            const itemAddCart = state.data.find(item => item.id === action.payload.id);
            if(itemAddCart){
                itemAddCart.qty++;
                localStorage.setItem("cart",JSON.stringify(state.data))
            }
        },
        removeItem : (state,action) => {
            state.data =state.data.filter(item => item.id !== action.payload.id)
            localStorage.setItem("cart",JSON.stringify(state.data))
        },
        clearCart: (state) => {
            state.data = [];
            localStorage.removeItem("cart");
        },
        setCart: (state, action) => {
        state.data = action.payload.map((item) => ({
            id: item.product_id,
            qty: item.quantity
        }));
        },
        resetCart: (state) => {
        state.data = [];
        }


    }
})

export const {setCart, addToCart, decreesItem, increesItem, removeItem, clearCart, resetCart} = cartSlice.actions;
export default cartSlice.reducer