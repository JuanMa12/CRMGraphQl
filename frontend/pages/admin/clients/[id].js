import React, { useState } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const CLIENT = gql`
  query getClient ($id: ID!) {
    getClient(id: $id) {
      name
      surname
      business
      email
      phone
    }
  }
`;

const UPDATE_CLIENT = gql`
  mutation updateClient($id: ID!, $input: ClientInput) {
    updateClient(id: $id,input: $input) {
      name
      surname
    }
  }
`;

function EditClient() {
    const router = useRouter()
    const { query: { id } } = router
    
    const [message, setMessage] = useState(null)

    // query
    const { data, loading, error } = useQuery(CLIENT, {
        variables: { id }
    })

    // mutation 
    const [ updateClient ] = useMutation(UPDATE_CLIENT)

    const validationSchema = Yup.object ({
        name: Yup.string().required('Name is required'),
        surname: Yup.string().required('Surname is required'),
        business: Yup.string().required('Business is required'),
        email: Yup.string().email('Email is not valid').required('Email is required'),
        phone: Yup.string().required('Phone is required')
                      .max(10, 'Password max 10 characters'),
    })

    if(loading) return 'Cargando...';

    const { getClient } = data;
    
    const updateForm = async values => {
       
       const { name, surname, business, email, phone } = values;

       try {
        const { data } = await updateClient({
           variables : {
             id,
             input: {
               name,
               surname,
               business,
               email,
               phone
             }
           }
         })
         console.log(data.updateClient)
         Swal.fire(
            'Success!',
            'Update Client',
            'success'
          )
         router.push('/admin/clients')
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
        <h1 className='text-2xl text-gray-800 font-light'>Edit Client</h1>
        {message && viewMessage()}
        <div className='mt-5'>
            <Formik 
                validationSchema={validationSchema} 
                initialValues={getClient}
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">Surname</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="surname" type="text" placeholder="Surname"
                                value={props.values.surname} 
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                />
                            </div>
                            { props.errors.surname && props.touched.surname ? (
                                <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold text-sm">{props.errors.surname}</p>
                                </div>
                            ) : null}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="business">Business</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="business" type="text" placeholder="Business"
                                value={props.values.business} 
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                />
                            </div>
                            { props.errors.business && props.touched.business ? (
                                <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold text-sm">{props.errors.business}</p>
                                </div>
                            ) : null}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email" type="email" placeholder="Email"
                                value={props.values.email} 
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                />
                            </div>
                            { props.errors.email && props.touched.email ? (
                                <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold text-sm">{props.errors.email}</p>
                                </div>
                            ) : null}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone" type="text" placeholder="Phone"
                                value={props.values.phone} 
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                />
                            </div>
                            { props.errors.phone && props.touched.phone ? (
                                <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold text-sm">{props.errors.phone}</p>
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

export default EditClient