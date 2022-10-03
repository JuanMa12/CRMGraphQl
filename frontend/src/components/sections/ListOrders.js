import React, { useEffect, useState} from 'react'
import { useMutation, gql } from '@apollo/client'
import Swal from 'sweetalert2'
import Router from 'next/router'

const REMOVE_ORDER = gql`
  mutation removeOrder($id: ID!) {
    removeOrder(id: $id)
  }
`;

const LIST_ORDERS = gql`
  query getOrders {
    getOrders {
      id
    }
  }
`;

function ListOrders({ order }) {

  const { id , total, client: { name , surname, email, phone }, status } = order

  const [ statusOrder, setStatusOrder ] = useState(status)
  const [ classOrder, setClassOrder ] = useState('')

  useEffect( () => {
    if(statusOrder) {
      setStatusOrder(statusOrder)
    }
    classOrderChange()
  }, [statusOrder] )

  const classOrderChange = () => {
    console.log(statusOrder)
    if(statusOrder === 'PENDING') {
        setClassOrder('border-yellow-500')
    } else if (statusOrder === 'COMPLETED') {
        setClassOrder('border-green-500')
    } else {
        setClassOrder('border-red-800')
    }
  }

  const [ removeOrder ] = useMutation(REMOVE_ORDER, {
    update(cache, { data: { removeOrder }  }) {
        // obtain cache
        const { getOrders } = cache.readQuery({ query : LIST_ORDERS })

        cache.writeQuery({ query : LIST_ORDERS, data: {
          getOrders: getOrders.filter( item => item.id !== id)
        }})
      }
    })

  const confirmDeleteOrder = () => {
    Swal.fire({
      title: 'Delete order?',
      text: "Remove Order!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(id)
        try {
          const { data } = await removeOrder({
             variables : {
               id
             }
           })
           Swal.fire(
            'Deleted!',
            data.removeOrder,
            'success'
          )
         } catch (error) {
            console.log(error)
            Swal.fire(
              'Not Deleted!',
              error.message,
              'danger'
            )
         }
      }
    })
  }

  return (
    <div className={` ${classOrder} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
      <div>
          <p className='font-bold text-gray-800 mb-2'>Client:</p>
          <p className='text-gray-800 mb-0'>{name} {surname}</p>
          {email && (
            <p className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {email}
            </p>
          )}
          {phone && (
            <p className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {phone}
            </p>
          )}
          <h2 className='text-gray-800 font-bold mt-5'>Status Order:</h2>
          <select className='mt-2 appearance-none bg-gray-600 border border-gray-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-gray-800 focus:border-gray-700 uppercase text-xs font-bold'
            value={statusOrder}>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
      </div>
      <div>
      <h2 className='text-gray-800 font-bold'>Summary</h2>
        { order.order.map( item => (
          <div key={item.id} className="mt-4">
            <p className='text-sm text-gray-600'>Producto: {item.name}</p>
            <p className='text-sm text-gray-600'>Cantidad: {item.quantity}</p>
          </div>
         ))
        }
        <p className='text-gray-800 mt-3 font-bold'>
          Total: <span className='font-light'>$ {total.toLocaleString('es-ES')} </span> 
        </p>
        <button className='flex justify-center items-center bg-red-800 py-2 px-4 w-full mt-2 text-white rounded text-xs uppercase' 
          type='button' onClick={ () => confirmDeleteOrder() } >
          Eliminar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ListOrders