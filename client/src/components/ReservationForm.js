import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch('/api/reservations')
      .then(response => response.json())
      .then(data => setReservations(data))
      .catch(error => console.error('Error fetching reservations:', error));
  }, []);

  const handleSubmit = (values, actions) => {
    fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Reservation created:', data);
        // Optionally, you may want to update the reservations state with the new reservation here
        actions.resetForm();
      })
      .catch(error => console.error('Error creating reservation:', error))
      .finally(() => actions.setSubmitting(false));
  };

  return (
    <div>
      <h2>Reservations</h2>
      <Formik
        initialValues={{ name: '', lastname: '', email: '', phonenumber: '', time: '', guest: '', orderlist: '', date: '' }}
        validate={values => {
          const errors = {};
          // Implement your validation logic here
          if (!values.name) {
            errors.name = 'Name is required';
          }
          if (!values.email) {
            errors.email = 'Email is required';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
          // Add more validation rules as needed
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" />

            <Field type="text" name="lastname" placeholder="Last Name" />
            <ErrorMessage name="lastname" component="div" />

            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            <Field type="text" name="phonenumber" placeholder="Phone Number" />
            <ErrorMessage name="phonenumber" component="div" />

            <Field type="time" name="time" placeholder="Time" />
            <ErrorMessage name="time" component="div" />

            <Field type="text" name="guest" placeholder="Guest" />
            <ErrorMessage name="guest" component="div" />

            <Field type="text" name="orderlist" placeholder="Order List" />
            <ErrorMessage name="orderlist" component="div" />

            {/* Example of a date field */}
            <Field type="date" name="date" placeholder="Date" />
            <ErrorMessage name="date" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>

      <h3>Current Reservations:</h3>
      <ul>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            <strong>Name:</strong> {reservation.name}, <strong>Email:</strong> {reservation.email}, <strong>Date:</strong> {reservation.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations;


//const Reservations = () => {
  //const [reservations, setReservations] = useState([]);

  //useEffect(() => {
    //fetch('/api/reservations')
      //.then(response => response.json())
      //.then(data => setReservations(data))
      //.catch(error => console.error('Error fetching reservations:', error));
 // }, []);

 // const handleSubmit = (values, actions) => {
    //fetch('/api/reservations', {
     // method: 'POST',
     // headers: {
      //  'Content-Type': 'application/json',
     // },
    //  body: JSON.stringify(values),
   // })
    //  .then(response => response.json())
    //  .then(data => {
    //   console.log('Reservation created:', data);
      //  actions.resetForm();
     // })
    //  .catch(error => console.error('Error creating reservation:', error))
   //   .finally(() => actions.setSubmitting(false));
  //};

 // return (
   // <div>
     // <h2>Reservations</h2>
     // <Formik
      //  initialValues={{ /* Define initial form values */ }}
      //  validate={/* Define validation schema */}
      //  onSubmit={handleSubmit}
    //  >
      //  {({ isSubmitting }) => (
       //   <Form>
       //     {/* Form fields */}
       //     <button type="submit" disabled={isSubmitting}>
        //      Submit
        //    </button>
        //  </Form>
      //  )}
    //  </Formik>
   //   {/* Display reservations */}
  //  </div>
//  );
//};

//export default Reservations;

