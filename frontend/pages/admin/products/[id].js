import React, { useState } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const GET_PRODUCT = gql`
  query getProduct ($id: ID!) {
    getProduct(id: $id) {
      name
      stock
      price
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $input: ProductInput) {
    updateProduct(id: $id,input: $input) {
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

function EditProduct() {
    const router = useRouter()
    const { query: { id } } = router
    
    const [message, setMessage] = useState(null)

    // query
    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: { id }
    })

    // mutation 
    const [ updateProduct ] = useMutation(UPDATE_PRODUCT,{
      update(cache, { data: { updateProduct  } }) {
        console.log('test')
        // obtain cache
        const { getProducts } = cache.readQuery({ query : LIST_PRODUCTS })
        console.log(getProducts)
        cache.writeQuery({ query : LIST_PRODUCTS, data: {
          getProducts: [...getProducts, updateProduct]
        } })
      }
    })

    const validationSchema = Yup.object ({
        name: Yup.string().required('Name is required'),
        stock: Yup.number().required('Stock is required').positive('Not values min 0').integer('Numbers int'),
        price: Yup.number().required('Price is required').positive('Not values min 0')
    })

    if(loading) return 'Cargando...';

    const { getProduct } = data;
    
    const updateForm = async values => {
       
       const { name, stock, price } = values;

       try {
        const { data } = await updateProduct({
           variables : {
             id,
             input: {
               name,
               stock,
               price
             }
           }
         })
         console.log(data.updateProduct)
         Swal.fire(
            'Success!',
            'Update Product',
            'success'
          )
         router.push('/admin/products')
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
        <h1 className='text-2xl text-gray-800 font-light'>Edit Product</h1>
        {message && viewMessage()}
        <div className='mt-5'>
            <Formik 
                validationSchema={validationSchema} 
                initialValues={getProduct}
                onSubmit={ (values) => updateForm(values) }>
                { props => {
                    return ( 
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name" type="text" placeholder="Name"
                                value={props.values.name} 
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                />
                            </div>
                            { props.errors.name && props.touched.name ? (
                                <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold text-sm">{props.errors.name}</p>
                                </div>
                            ) : null}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Stock</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="stock" type="number" placeholder="Stock"
                                value={props.values.stock} 
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                />
                            </div>
                            { props.errors.stock && props.touched.stock ? (
                                <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold text-sm">{props.errors.stock}</p>
                                </div>
                            ) : null}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="price" type="number" placeholder="Price"
                                value={props.values.price} 
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                />
                            </div>
                            { props.errors.price && props.touched.price ? (
                                <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold text-sm">{props.errors.price}</p>
                                </div>
                            ) : null}
                            <input type="submit" className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900" 
                                value="Update"/>
                        </form>
                        )
                    }
                }
          </Formik>
        </div>
      </>
    )
}

export default EditProduct