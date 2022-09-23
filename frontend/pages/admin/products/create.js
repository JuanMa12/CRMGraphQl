import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const NEW_PRODUCT = gql`
  mutation newProduct($input: ProductInput) {
    newProduct(input: $input) {
      name
      stock
      price
    }
  }
`;

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

function addProduct() {
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

  // valid form
  const formik = useFormik({
    initialValues: {
      name: '',
      stock: '',
      price: ''
    },
    validationSchema: Yup.object ({
      name: Yup.string().required('Name is required'),
      stock: Yup.number().required('Stock is required').positive('Not values min 0').integer('Numbers int'),
      price: Yup.number().required('Price is required').positive('Not values min 0')
    }),
    onSubmit: async values => {
      //console.log(values)
      const { name, stock, price } = values

      try {
       const { data } = await newProduct({
          variables : {
            input: {
              name,
              stock,
              price
            }
          }
        })
        console.log(data.newProduct)
        router.push('/admin/products')
      } catch (error) {
        console.log(error)
        setMessage(error.message)

        setTimeout(() => {
          setMessage(null)
        }, 2000)
      }
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
      <h1 className='text-2xl text-gray-800 font-light'>New Product</h1>
      {message && viewMessage()}
      <div className='mt-5'>
        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name" type="text" placeholder="Name"
                value={formik.values.name} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
            </div>
            { formik.errors.name && formik.touched.name ? (
              <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold text-sm">{formik.errors.name}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Stock</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="stock" type="number" placeholder="Stock"
                value={formik.values.stock} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
            </div>
            { formik.errors.stock && formik.touched.stock ? (
              <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold text-sm">{formik.errors.stock}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price" type="number" placeholder="Price"
                value={formik.values.price} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
            </div>
            { formik.errors.price && formik.touched.price ? (
              <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold text-sm">{formik.errors.price}</p>
              </div>
            ) : null}
            <input type="submit" className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900" 
                value="Send"/>
        </form>
      </div>
    </>
  )
}

export default addProduct