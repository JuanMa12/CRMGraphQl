import { useReducer } from "react";
import OrderContext from "./OrderContext";
import OrderReducer from "./OrderReducer"

import {
    SELECT_CLIENT,
    SELECT_PRODUCTS,
    QUANTITY_PRODUCTS,
    UPDATE_TOTAL
} from '../../types'

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

        let newState;
        if(state.products > 0) {
            newState = products.map( item => {
                const newItem = state.products.find( productState => productState.id == item.id)
                return {...item, ...newItem}
            })
        } else {
            newState = products;
        }

        dispatch({
            type: SELECT_PRODUCTS,
            payload: newState
        })
    }

    const quantityProductsState = quantity => {
        dispatch({
            type: QUANTITY_PRODUCTS,
            payload: quantity
        })
    }

    const updateTotalState = () => {
        dispatch({
            type: UPDATE_TOTAL
        })
    }

    return (
        <OrderContext.Provider value={{
                client: state.client,
                products: state.products,
                total: state.total,
                addClientState, 
                addProductsState,
                quantityProductsState,
                updateTotalState
            }}>
            {children}
        </OrderContext.Provider>
    )   
}

export default OrderState