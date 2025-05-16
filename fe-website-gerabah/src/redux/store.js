import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slice/cartSlice"

const store = configureStore({
    reducer : {
        cart : cartReducer
    }
})

console.log("Oncreate Store",store.getState())

// untuk melihat perubahan yang terjadi dlm store 
store.subscribe(() => {
    console.log("STORE CHANGED",store.getState())
})

export default store;