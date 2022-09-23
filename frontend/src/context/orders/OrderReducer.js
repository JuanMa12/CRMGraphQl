import {
    SELECT_CLIENT,
    SELECT_PRODUCTS,
    QUANTITY_PRODUCTS
} from '../../types'

export default (state, action) => {
    switch(action.type) {
        case SELECT_CLIENT:
            return {
                ...state,
                client: action.payload
            }
        case SELECT_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }
        case QUANTITY_PRODUCTS:
            return {
                ...state,
                total: action.payload
            }
        default: 
            return state
    }
}