import { useReducer } from "react";
import OrderContext from "./OrderContext";
import OrderReducer from "./OrderReducer"

import {
    SELECT_CLIENT,
    SELECT_PRODUCTS,
    QUANTITY_PRODUCTS
} from '../../types'
import products from "../../../pages/admin/orders";


const OrderState = ({children}) => {

    const initialState = {
        client: {},
        products: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(OrderReducer, initialState);

    const addClientState = client => {
        //console.log(client)
        dispatch({
            type: SELECT_CLIENT,
            payload: client
        })
    }

    const addProductsState = products => {
        //console.log(client)
        dispatch({
            type: SELECT_PRODUCTS,
            payload: products
        })
    }

    return (
        <OrderContext.Provider value={{
            addClientState, 
            addProductsState
            }}>
            {children}
        </OrderContext.Provider>
    )   
}

export default OrderState