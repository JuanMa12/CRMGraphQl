import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

import ListClients from '../../../src/components/sections/ListClients'

const LIST_CLIENTS = gql`
  query getClientsSeller {
    getClientsSeller {
      id
      name
      surname
      business
      email
      phone
    }
  }
`;

function clients() {
  const router = useRouter()

  const { data, loading, error } = useQuery(LIST_CLIENTS)

  if(loading) return 'Cargando...';

  if(!data.getClientsSeller) {
    return router.push('/')
  }     

  return (
    <>
      <h1 className='text-2xl text-gray-800 font-light'>Clients</h1>

      <Link href="/admin/clients/create">
        <a className='bg-gray-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-600'>
          ADD CLIENT
        </a>
      </Link>


      <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Name</th>
              <th className='w-1/5 py-2'>Business</th>
              <th className='w-1/5 py-2'>Email</th>
              <th className='w-1/5 py-2'>Acciones</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.getClientsSeller.map(client => (
              <ListClients key={client.id} client={client} />
            ))}
          </tbody>
      </table>
    </>
  )
}

export default clients