import React, { useContext, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

import AddClient from '../../../src/components/sections/orders/AddClient'
import AddProducts from '../../../src/components/sections/orders/AddProducts'
import SummaryOrder from '../../../src/components/sections/orders/SummaryOrder'
import Total from '../../../src/components/sections/orders/Total'
import OrderContext from '../../../src/context/orders/OrderContext'

const NEW_ORDER = gql`
  mutation newOrder($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`;

function addOrder() {
  const router = useRouter()
  const [message, setMessage] = useState(null)

  const orderContext = useContext(OrderContext)
  const { client, products, total } = orderContext

  // mutation 
  const [ newOrder ] = useMutation(NEW_ORDER
  //   {
  //   update(cache, { data: { newOrder }  }) {
  //     // obtain cache
  //     const { getProducts } = cache.readQuery({ query : LIST_PRODUCTS })

  //     cache.writeQuery({ query : LIST_PRODUCTS, data: {
  //       getProducts: [...getProducts, newOrder]
  //     } })
  //   }
  // }
  )

  const validOrder = () => {
    return !products.every( product => product.quantity > 0 ) || total === 0 || client.length === 0 ? " opacity-50 cursor-not-allowed " : "";
  }

  const createOrder = async () => {
    const { id } = client
    const order = products.map(({__typename, stock, ...product}) => product)
    console.log(order)
    try {
      const { data } = await newOrder({
        variables: {
          input: {
            client: id,
            total,
            order
          }
        }
      })
      console.log(data)
      Swal.fire(
        'Success!',
        'Create Order',
        'success'
      )
      router.push('/admin/orders')
    } catch (error) {
      console.log(error)
      setMessage(error.message)

      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
  }

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
            <Total />
            <button type="button" 
                className={` bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validOrder()}`} 
                onClick={() => createOrder()}
                >
              Send
            </button>
        </form>
      </div>
    </>
  )
}

export default addOrder