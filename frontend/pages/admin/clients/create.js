import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const NEW_CLIENT = gql`
  mutation newClient($input: ClientInput) {
    newClient(input: $input) {
      name
      surname
    }
  }
`;

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

function addClient() {
  const router = useRouter()
  const [message, setMessage] = useState(null)

  // mutation 
  const [ newClient ] = useMutation(NEW_CLIENT, {
    update(cache, { data: { newClient }  }) {
      // obtain cache
      const { getClientsSeller } = cache.readQuery({ query : LIST_CLIENTS })

      cache.writeQuery({ query : LIST_CLIENTS, data: {
        getClientsSeller: [...getClientsSeller, newClient]
      } })
    }
  })

  // valid form
  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      business: '',
      email: '',
      phone: ''
    },
    validationSchema: Yup.object ({
      name: Yup.string().required('Name is required'),
      surname: Yup.string().required('Surname is required'),
      business: Yup.string().required('Business is required'),
      email: Yup.string().email('Email is not valid').required('Email is required'),
      phone: Yup.string().required('Phone is required')
                    .max(10, 'Password max 10 characters'),
    }),
    onSubmit: async values => {
      //console.log(values)
      const { name, surname, business, email, phone } = values

      try {
       const { data } = await newClient({
          variables : {
            input: {
              name,
              surname,
              business,
              email,
              phone
            }
          }
        })
        console.log(data.newClient)
        router.push('/admin/clients')
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
      <h1 className='text-2xl text-gray-800 font-light'>New Client</h1>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">Surname</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="surname" type="text" placeholder="Surname"
                value={formik.values.surname} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
            </div>
            { formik.errors.surname && formik.touched.surname ? (
              <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold text-sm">{formik.errors.surname}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="business">Business</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="business" type="text" placeholder="Business"
                value={formik.values.business} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
            </div>
            { formik.errors.business && formik.touched.business ? (
              <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold text-sm">{formik.errors.business}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email" type="email" placeholder="Email"
                value={formik.values.email} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
            </div>
            { formik.errors.email && formik.touched.email ? (
              <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold text-sm">{formik.errors.email}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone" type="text" placeholder="Phone"
                value={formik.values.phone} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                />
            </div>
            { formik.errors.phone && formik.touched.phone ? (
              <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold text-sm">{formik.errors.phone}</p>
              </div>
            ) : null}
            <input type="submit" className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900" 
                value="Send"/>
        </form>
      </div>
    </>
  )
}

export default addClient