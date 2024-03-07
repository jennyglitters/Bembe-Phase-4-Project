import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUser } from './UserContext';
import { useParams } from 'react-router-dom';


const ReservationForm = () => {
  const { reservationId } = useParams();
  const { userToken, isAuthenticated } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    lastname: '',
    email: '',
    phonenumber: '',
    date: new Date(),
    time: '',
    guests: 1,
    menuItems: [],
    specialNotes: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

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

  useEffect(() => {
    if (reservationId) {
      const fetchReservationDetails = async () => {
        try {
          const response = await fetch(`/reservations/${reservationId}`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
          });

          if (response.ok) {
            const reservation = await response.json();
            setInitialValues({
              name: reservation.name,
              lastname: reservation.lastname,
              email: reservation.email,
              phonenumber: reservation.phonenumber,
              date: new Date(reservation.date),
              time: reservation.time,
              guests: reservation.guests.toString(),
              menuItems: reservation.menuItems.map(item => item.id), // Assuming you want to keep IDs
              specialNotes: reservation.specialNotes,
            });
          } else {
            console.error('Failed to fetch reservation details.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchReservationDetails();
    }
  }, [reservationId, userToken]);

  const handleSubmit = async (values, { setSubmitting }) => {
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
        throw new Error(`Failed to ${reservationId ? 'update' : 'create'} reservation.`);
      }
    } catch (error) {
      setSubmissionStatus(error.message);
      console.error('Error:', error);
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h1>{reservationId ? 'Update Your Reservation' : 'Make a Reservation'}</h1>
      <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
        {({ setFieldValue, isSubmitting, values }) => (
          <Form>
            <Field name="name" placeholder="First Name" />
            <ErrorMessage name="name" component="div" />

            <Field name="lastname" placeholder="Last Name" />
            <ErrorMessage name="lastname" component="div" />

            <Field name="email" type="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            <div>
              <label htmlFor="date">Date</label>
              <ReactDatePicker
                selected={values.date}
                onChange={date => setFieldValue('date', date)}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
              />
              <ErrorMessage name="date" component="div" />
            </div>

            {/* Include other fields like time, guests, menu items, and special notes here */}

            <button type="submit" disabled={isSubmitting}>
              {reservationId ? 'Update Reservation' : 'Submit Reservation'}
            </button>
          </Form>
        )}
      </Formik>
      {submissionStatus && <div>{submissionStatus}</div>}
    </div>
  );
};

export default ReservationForm;
