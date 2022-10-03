import React from 'react'
import { useMutation, gql } from '@apollo/client'
import Swal from 'sweetalert2'
import Router from 'next/router'

const REMOVE_PRODUCT = gql`
  mutation removeProduct($id: ID!) {
    removeProduct(id: $id)
  }
`;

const LIST_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
    }
  }
`;

function ListProducts({ product }) {

  const { id, name , stock, price } = product

  const [ removeProduct ] = useMutation(REMOVE_PRODUCT, {
    update(cache, { data: { removeProduct }  }) {
        // obtain cache
        const { getProducts } = cache.readQuery({ query : LIST_PRODUCTS })

        cache.writeQuery({ query : LIST_PRODUCTS, data: {
          getProducts: getProducts.filter( item => item.id !== id)
        }})
      }
    })

  const confirmDeleteProduct = () => {
    Swal.fire({
      title: 'Delete product?',
      text: "Remove Product!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await removeProduct({
             variables : {
               id
             }
           })
           Swal.fire(
            'Deleted!',
            data.removeProduct,
            'success'
          )
         } catch (error) {
           console.log(error)
         }
      }
    })
  }

  const editProduct = () => {
    Router.push({
      pathname: "/admin/products/[id]",
      query: { id }
    })
  }

  return (
    <tr>
      <td className='border px-4 py-2'>{name}</td>
      <td className='border px-4 py-2'>{stock}</td>
      <td className='border px-4 py-2'>${price.toLocaleString('es-ES')}</td>
      <td className='border px-4 py-2 flex'>
        <button className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase' 
          type='button' onClick={ () => confirmDeleteProduct() } >
          Eliminar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button className='flex justify-center items-center bg-green-800 py-2 px-4 w-full text-white rounded text-xs uppercase ml-2' 
          type='button' onClick={ () => editProduct() } >
          Editar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
      </td>
    </tr>
  )
}

export default ListProducts