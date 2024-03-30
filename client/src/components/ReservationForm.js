import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { useUser } from './UserContext';
import * as Yup from 'yup';

const ReservationForm = () => {
  const { reservationId } = useParams();
  const { userToken } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    phonenumber: '',
    date: new Date(),
    time: '',
    guests: '',
    menuItems: [],
    specialNotes: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/menu_items', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
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

    const fetchReservationDetails = async () => {
      if (!reservationId) return;

      try {
        const response = await fetch(`/reservations/${reservationId}`, {
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
        if (response.ok) {
          const reservation = await response.json();
          setInitialValues({
            ...reservation,
            date: new Date(reservation.date),
            guests: reservation.guest_count.toString(),
            menuItems: reservation.menuItems.map(item => item.id),
          });
        } else {
          console.error('Failed to fetch reservation details.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMenuItems();
    fetchReservationDetails();
  }, [reservationId, userToken]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log('Submitting with values:', values);
    const formattedDate = values.date.toISOString().split('T')[0];
    const payload = {
      ...values,
      date: formattedDate,
      menuItems: values.menuItems.map(Number),
      ...(values.password && !reservationId ? { password: values.password } : {}),
    };

    console.log('Payload:', payload);

    const endpoint = reservationId ? `/reservations/${reservationId}` : '/reservations';
    const method = reservationId ? 'PUT' : 'POST';

    console.log(`Making a ${method} request to ${endpoint} with payload:`, payload);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${reservationId ? 'update' : 'create'} reservation.`);
      }

      const responseData = await response.json();
      console.log('Success response data:', responseData);
      setSubmissionStatus({ success: `Reservation ${reservationId ? 'updated' : 'created'} successfully.` });
      resetForm(); // Optionally reset form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus({ error: error.toString() });
    } finally {
      setSubmitting(false);
    }
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phonenumber: Yup.string()
  .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in the format 123-456-7890')
  .required('Phone number is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  guests: Yup.number().required('Number of guests is required').positive('Number of guests must be positive').integer('Number of guests must be an integer'),
  menuItems: Yup.array().of(Yup.number().positive('Invalid menu item ID')).required('At least one menu item is required'),
  specialNotes: Yup.string().trim(),
  ...(reservationId ? {} : {
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
  }),
});

  return (
    <div>
      <h1>{reservationId ? 'Update Your Reservation' : 'Make a Reservation'}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting, values }) => ( // Ensure 'values' is included here
          <Form>
            <Field name="name" placeholder="First Name" />
            <ErrorMessage name="name" component="div" />

            <Field name="lastname" placeholder="Last Name" />
            <ErrorMessage name="lastname" component="div" />

            <Field name="phonenumber" type="tel" placeholder="Phone Number" />
            <ErrorMessage name="phonenumber" component="div" />

            <Field name="email" type="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            {!reservationId && (
              <div>
                <Field name="password" type="password" placeholder="Password" />
                <ErrorMessage name="password" component="div" />
              </div>
            )}

            <div>
              <label htmlFor="date">Date</label>
              <ReactDatePicker
                selected={values.date}
                onChange={date => setFieldValue('date', date)}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                name="date"
              />
              <ErrorMessage name="date" component="div" />
            </div>

            <div>
              <label htmlFor="time">Time</label>
              <Field name="time" type="time" placeholder="HH:MM" />
              <ErrorMessage name="time" component="div" />
            </div>

            <div>
              <label htmlFor="guests">Guests</label>
              <Field name="guests" placeholder="Number of Guests" />
              <ErrorMessage name="guests" component="div" />
            </div>

            <div>
              <label htmlFor="menuItems">Menu Items</label>
              <Field as="select" name="menuItems" multiple>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="menuItems" component="div" />
            </div>

            <div>
              <label htmlFor="specialNotes">Special Notes</label>
              <Field name="specialNotes" as="textarea" placeholder="Special Notes" />
              <ErrorMessage name="specialNotes" component="div" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {reservationId ? 'Update Reservation' : 'Submit Reservation'}
            </button>
          </Form>
        )}
      </Formik>
      {submissionStatus.success && <div className="success">{submissionStatus.success}</div>}
      {submissionStatus.error && <div className="error">{submissionStatus.error}</div>}
    </div>
  );
};

export default ReservationForm;
