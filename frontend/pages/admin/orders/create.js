import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

import AddClient from '../../../src/components/sections/orders/AddClient'
import AddProducts from '../../../src/components/sections/orders/AddProducts'
import SummaryOrder from '../../../src/components/sections/orders/SummaryOrder'

const NEW_PRODUCT = gql`
  mutation newProduct($input: ProductInput) {
    newProduct(input: $input) {
      name
      stock
      price
    }
  }
`;

function addOrder() {
  const router = useRouter()
  const [message, setMessage] = useState(null)

  // mutation 
  const [ newProduct ] = useMutation(NEW_PRODUCT, {
    update(cache, { data: { newProduct }  }) {
      // obtain cache
      const { getProducts } = cache.readQuery({ query : LIST_PRODUCTS })

      cache.writeQuery({ query : LIST_PRODUCTS, data: {
        getProducts: [...getProducts, newProduct]
      } })
    }
  })

  const viewMessage = () => {
    return (
      <div className="bg-blue-600 py-2 px-3 w-full max-w-sm text-center mx-auto my-2">
        <p className="font-bold text-white">{message}</p>
      </div>
    )
  }

  return (
    <>
      <h1 className='text-2xl text-gray-800 font-light'>New Order</h1>
      {message && viewMessage()}
      <div className='mt-5'>
        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
            <AddClient />
            <AddProducts />
            <SummaryOrder />
            <input type="submit" className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900" 
                value="Send"/>
        </form>
      </div>
    </>
  )
}

export default addOrder