import React, { useContext, useState, useEffect } from 'react'
import OrderContext from '../../../context/orders/OrderContext';

function SummaryProduct ({product}) {

  const { name , price } = product

  const [quantity, setQuantity] = useState(0);

  const orderContext = useContext(OrderContext);
  const { quantityProductsState, updateTotalState } = orderContext;

  useEffect(() => {
    updateQuantity()
    updateTotalState()
  },[quantity])

  const updateQuantity = () => {
    const newProduct = {...product, quantity: Number(quantity) }
    quantityProductsState(newProduct)
  }

  

  return (
    <>
        <div className='md:flex md:justify-between md:items-center mt-5'>
            <div className='md:w-2/4 mb-2 md:mb-0'>
              <p className='text-sm'>{name}</p>
              <p>${price.toLocaleString('es-ES')}</p>
            </div>
            <input type="number" placeholder="Quantity" 
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-2' 
              onChange={ (e) => setQuantity(e.target.value)} value={quantity} />
        </div>
    </>
  )
}

export default SummaryProduct