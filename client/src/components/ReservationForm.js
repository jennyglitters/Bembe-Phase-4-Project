import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Reservations = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    // Fetch menu items from the backend
    fetch('/api/menu-items')
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error('Error fetching menu items:', error));
  }, []);

  const validate = values => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    if (!values.lastname) errors.lastname = 'Required';
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.phonenumber) errors.phonenumber = 'Required';
    if (!values.date) errors.date = 'Required';
    if (!values.time) errors.time = 'Required';
    if (!values.guests) {
      errors.guests = 'Required';
    } else if (isNaN(values.guests) || values.guests < 1 || values.guests > 20) {
      errors.guests = 'Must be a number between 1 and 20';
    }
    return errors;
  };

  const handleSubmit = (values, actions) => {
    fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      setCurrentReservation(data);
      setSubmissionMessage('Reservation created successfully!');
      actions.resetForm();
    })
    .catch(error => {
      console.error('Error creating reservation:', error);
      setSubmissionMessage('Failed to create reservation. Please try again.');
      actions.setErrors({ submit: 'There was a problem creating your reservation.' });
    })
    .finally(() => actions.setSubmitting(false));
  };

  const handleClearForm = (resetForm) => {
    resetForm();
    setSubmissionMessage('');
  };
  
  return (
    <div>
      <h2>Make a Reservation</h2>
      {submissionMessage && (
    <div className="submission-message">
      {submissionMessage}
    </div>
  )}
  <Formik
    initialValues={{
      name: '',
      lastname: '',
      email: '',
      phonenumber: '',
      time: '',
      guests: '',
      menuItems: [], // Holds selected menu items
      date: ''
    }}
    // Validation logic 
    validate={validate}
    onSubmit={handleSubmit}
  >
  
{({ values, setFieldValue, isSubmitting, resetForm }) => (
  <Form>
    <div className="form-field">
      <label htmlFor="name">Name</label>
      <Field id="name" name="name" placeholder="Your Name" />
      <ErrorMessage name="name" component="div" className="field-error" />
    </div>

    <div className="form-field">
      <label htmlFor="lastname">Last Name</label>
      <Field id="lastname" name="lastname" placeholder="Your Last Name" />
      <ErrorMessage name="lastname" component="div" className="field-error" />
    </div>

    <div className="form-field">
      <label htmlFor="email">Email</label>
      <Field id="email" name="email" type="email" placeholder="Your Email Address" />
      <ErrorMessage name="email" component="div" className="field-error" />
    </div>

    <div className="form-field">
      <label htmlFor="phonenumber">Phone Number</label>
      <Field id="phonenumber" name="phonenumber" placeholder="Your Phone Number" />
      <ErrorMessage name="phonenumber" component="div" className="field-error" />
    </div>

    <div className="form-field">
      <label htmlFor="date">Date</label>
      <Field id="date" name="date" type="date" />
      <ErrorMessage name="date" component="div" className="field-error" />
    </div>

    <div className="form-field">
      <label htmlFor="time">Time</label>
      <Field id="time" name="time" type="time" />
      <ErrorMessage name="time" component="div" className="field-error" />
    </div>

    <div className="form-field">
      <label htmlFor="guests">Number of Guests</label>
      <Field id="guests" name="guests" type="number" />
      <ErrorMessage name="guests" component="div" className="field-error" />
    </div>

    {/* Field to select menu items */}
    <div role="group" aria-labelledby="checkbox-group" className="form-field">
      <h3>Menu Items</h3>
      {menuItems.map((item) => (
        <label key={item.id}>
          <Field
            type="checkbox"
            name="menuItems"
            value={item.name}
            checked={values.menuItems.includes(item.name)}
            onChange={() => {
              const nextValue = values.menuItems.includes(item.name)
                ? values.menuItems.filter((i) => i !== item.name)
                : [...values.menuItems, item.name];
              setFieldValue('menuItems', nextValue);
            }}
          />
          {item.name}
        </label>
      ))}
    </div>
    
    {/* Field for Special Notes */}
    <div className="form-field">
      <label htmlFor="specialNotes">Special Notes</label>
      <Field as="textarea" id="specialNotes" name="specialNotes" placeholder="Any special notes or requests?" />
      <ErrorMessage name="specialNotes" component="div" className="field-error" />
    </div>

    <button type="submit" disabled={isSubmitting} className="submit-button">
      Submit Reservation
    </button>
    <button type="button" onClick={() => handleClearForm(resetForm)} className="clear-form-button">
      Clear Form
    </button>
  </Form>
)}
</Formik>

{/* Display the current user's reservation */}
{currentReservation && (
  <div>
    <h3>Your Current Reservation:</h3>
    <p><strong>Name:</strong> {`${currentReservation.name} ${currentReservation.lastname}`}</p>
    <p><strong>Email:</strong> {currentReservation.email}</p>
    <p><strong>Phone Number:</strong> {currentReservation.phonenumber}</p>
    <p><strong>Date:</strong> {currentReservation.date}</p>
    <p><strong>Time:</strong> {currentReservation.time}</p>
    <p><strong>Guests:</strong> {currentReservation.guests}</p>
    <p><strong>Menu Items:</strong> {currentReservation.menuItems.join(', ')}</p>
    {/* Display special notes */}
    {currentReservation.specialNotes && (
      <p><strong>Special Notes:</strong> {currentReservation.specialNotes}</p>
    )}
  </div>
)}

export default Reservations;
