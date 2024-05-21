import { createSlice } from "@reduxjs/toolkit"

const userStore = createSlice({
    name: "user",
    initialState: {
        walletAddr: localStorage.getItem('walletAddr') || '',
    },
    reducers: {
        setAddr(state, action) {
            state.walletAddr = action.payload
            localStorage.setItem("walletAddr", state.walletAddr)
        },
        removeAddr(state) {
            state.walletAddr = ''
            localStorage.removeItem("walletAddr")
        }
    }
})

const { setAddr, removeAddr } = userStore.actions;
const reducer = userStore.reducer

export { setAddr, removeAddr }
export default reducer