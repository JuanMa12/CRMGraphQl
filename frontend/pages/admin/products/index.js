import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

import ListProducts from '../../../src/components/sections/ListProducts'

const LIST_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      stock
      price
    }
  }
`;

function products() {
  const router = useRouter()

  const { data, loading, error } = useQuery(LIST_PRODUCTS)

  if(loading) return 'Cargando...';

  if(!data.getProducts) {
    return router.push('/')
  }     

  return (
    <>
      <h1 className='text-2xl text-gray-800 font-light'>Products</h1>

      <Link href="/admin/products/create">
        <a className='bg-gray-800 w-full lg:w-auto text-center py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-600'>
          ADD PRODUCT
        </a>
      </Link>

      <div className='overflow-x-scroll'>
        <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800'>
              <tr className='text-white'>
                <th className='w-1/5 py-2'>Name</th>
                <th className='w-1/5 py-2'>Stock</th>
                <th className='w-1/5 py-2'>Price</th>
                <th className='w-1/5 py-2'>Acciones</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {data.getProducts.map(product => (
                <ListProducts key={product.id} product={product} />
              ))}
            </tbody>
        </table>
      </div>
    </>
  )
}

export default products