import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

import ListOrders from '../../../src/components/sections/ListOrders'

const LIST_ORDERS = gql`
  query getOrdersSeller {
    getOrdersSeller {
      id
      order {
        id
        name
        quantity
      }
      client {
        id
        name
        surname
        email
        phone
      }
      status
      total
    }
  }
`;

function orders() {
  const router = useRouter()

  const { data, loading, error } = useQuery(LIST_ORDERS)

  if(loading) return 'Cargando...';
  
  if(!data.getOrdersSeller) {
    return router.push('/')
  }     

  return (
    <>
      <h1 className='text-2xl text-gray-800 font-light'>Orders</h1>

      <Link href="/admin/orders/create">
        <a className='bg-gray-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-600'>
          ADD ORDER
        </a>
      </Link>

      {data.getOrdersSeller.map(order => (
        <ListOrders key={order.id} order={order} />
      ))}
    </>
  )
}

export default orders