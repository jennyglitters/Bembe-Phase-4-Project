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
        actions.resetForm();
      })
      .catch(error => console.error('Error creating reservation:', error))
      .finally(() => actions.setSubmitting(false));
  };

  return (
    <div>
      <h2>Reservations</h2>
      <Formik
        initialValues={{ /* Define initial form values */ }}
        validate={/* Define validation schema */}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Form fields */}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      {/* Display reservations */}
    </div>
  );
};

export default Reservations;