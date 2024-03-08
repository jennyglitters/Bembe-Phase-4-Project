import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';

const ReservationForm = () => {
 const { reservationId } = useParams();
 const [menuItems, setMenuItems] = useState([]);
 const [initialValues, setInitialValues] = useState({
    name: '',
    lastname: '',
    email: '',
    phonenumber: '',
    date: new Date(),
    time: '',
    guests: '',
    menuItems: [],
    specialNotes: '',
 });
 const [submissionStatus, setSubmissionStatus] = useState('');

 useEffect(() => {
    // Fetch menu items
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/menu_items');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();

    // Fetch reservation details if reservationId is present
    if (reservationId) {
      const fetchReservationDetails = async () => {
        try {
          const response = await fetch(`/reservations/${reservationId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch reservation details');
          }
          const data = await response.json();
          setInitialValues({
            ...data,
            date: new Date(data.date), // Convert date string to Date object
            menuItems: data.menuItems.map(item => ({ id: item.id, name: item.name })), // Map menu items to objects with id and name
          });
        } catch (error) {
          console.error('Error fetching reservation details:', error);
        }
      };
      fetchReservationDetails();
    }
 }, [reservationId]);

 const handleSubmit = async (values, { setSubmitting }) => {
    const endpoint = reservationId ? `/reservations/${reservationId}` : '/reservations';
    const method = reservationId ? 'PUT' : 'POST';
    // Prepare the data to be sent to the server
    const data = {
      ...values,
      date: values.date.toISOString(), // Convert date to ISO string
      menuItems: values.menuItems.map(item => item.id), // Map menu items to their IDs
    };

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmissionStatus(`Reservation ${reservationId ? 'updated' : 'created'} successfully.`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${reservationId ? 'update' : 'create'} reservation.`);
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
            {/* Form fields */}
            {/* ... */}
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