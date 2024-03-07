//ReservationForm
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useUser} from './UserContext'; //

// const ReservationForm = () => {
//   const { user, isAuthenticated, login } = useUser();
//   const [menuItems, setMenuItems] = useState([]);
//   const [currentReservation, setCurrentReservation] = useState(null);
//   const [submissionMessage, setSubmissionMessage] = useState('');
//   const [guests, setGuests] = useState(1);
//   const maxGuests = 8;
//   const [isMaxCapacity, setIsMaxCapacity] = useState(false);


const ReservationForm = ({ reservationId }) => {
  // Use the useUser hook to access userToken and isAuthenticated
  const { userToken, isAuthenticated } = useUser();

  // Define the necessary states and hooks
  const [menuItems, setMenuItems] = useState([]); // To store the available menu items
  const [initialValues, setInitialValues] = useState({}); // To store the initial form values
  const [submissionStatus, setSubmissionStatus] = useState(''); // To display the submission status

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/menu_items');
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          console.error('Failed to fetch menu items.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // Fetch reservation details if reservationId is provided
  useEffect(() => {
    if (reservationId) {
      const fetchReservationDetails = async () => {
        try {
          const response = await fetch(`/reservations/${reservationId}`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
          });

          if (response.ok) {
            const reservation = await response.json();
            // Set the initial form values based on the fetched reservation details
            setInitialValues({
              name: reservation.name,
              lastname: reservation.lastname,
              email: reservation.email,
              phonenumber: reservation.phonenumber,
              date: new Date(reservation.date),
              time: reservation.time,
              guests: reservation.guests.toString(),
              specialNotes: reservation.specialNotes,
              menuItems: reservation.menuItems.map(item => item.name),
            });
          } else {
            console.error('Failed to fetch reservation details.');
            setSubmissionStatus('Failed to fetch reservation details.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchReservationDetails();
    }
  }, [reservationId, userToken]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    if (isAuthenticated) {
      // If the user is authenticated, create or update the reservation
      const endpoint = reservationId ? `/reservations/${reservationId}` : '/reservations';
      const method = reservationId ? 'PUT' : 'POST';

      try {
        const response = await fetch(endpoint, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setSubmissionStatus(`Reservation ${reservationId ? 'updated' : 'created'} successfully.`);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        setSubmissionStatus(`Failed to ${reservationId ? 'update' : 'create'} reservation.`);
        console.error('Error:', error);
      }
    } else {
      // If the user is not authenticated, create a new user and then create the reservation
      try {
        const userResponse = await fetch('/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, password: 'defaultPassword' }),
        });

        if (userResponse.ok) {
          const reservationResponse = await fetch('/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (reservationResponse.ok) {
            setSubmissionStatus('Reservation created successfully.');
          } else {
            throw new Error('Reservation creation failed.');
          }
        } else {
          throw new Error('User registration failed.');
        }
      } catch (error) {
        setSubmissionStatus(error.message);
        console.error('Error:', error);
      }
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h1>{reservationId ? 'Update Your Reservation' : 'Make a Reservation'}</h1>
      <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form>
            {/* Render the form fields */}
            <Field name="name" placeholder="First Name" />
            <ErrorMessage name="name" component="div" />

            <Field name="lastname" placeholder="Last Name" />
            <ErrorMessage name="lastname" component="div" />

            <Field name="email" type="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            {/* Render additional form fields */}
            {/* ... */}

            <button type="submit">{reservationId ? 'Update Reservation' : 'Submit Reservation'}</button>
          </Form>
        )}
      </Formik>
      {submissionStatus && <div>{submissionStatus}</div>}
    </div>
  );
};

export default ReservationForm;