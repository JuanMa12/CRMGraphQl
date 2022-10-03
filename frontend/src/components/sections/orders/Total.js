import React, { useContext } from 'react'
import OrderContext from '../../../context/orders/OrderContext';

function Total() {
    const orderContext = useContext(OrderContext);
    const { total } = orderContext;

    return (
        <div className="flex items-center mt-5 justify-between bg-gray-300 p-3 border-solid border-2 border-gray-100">
            <h1 className='text-gray-800 text-leg'>Total</h1>
            <p className='text-ray-800 mt-0'>${total.toLocaleString('es-ES')}</p>
        </div>
    )
}

export default Total