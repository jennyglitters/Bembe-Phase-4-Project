import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [guests, setGuests] = useState(1);
  const maxGuests = 8;
  const [isMaxCapacity, setIsMaxCapacity] = useState(false);

  useEffect(() => {
    // Fetch menu items from the backend
    fetch('/menu_items')
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

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 15; i <= 23; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      slots.push(`${hour}:00 ${i >= 12 ? 'PM' : 'AM'}`);
      slots.push(`${hour}:30 ${i >= 12 ? 'PM' : 'AM'}`);
    }
    return slots;
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Determine if this is an update or a new reservation based on the presence of a currentReservation ID
    const isUpdate = currentReservation && currentReservation.id;
    const endpoint = isUpdate ? `/reservations/${currentReservation.id}` : '/reservations';
    const method = isUpdate ? 'PUT' : 'POST';
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Add Authorization header if a token exists (user is logged in)
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    // Adjust payload for PUT request to include existing reservation data
    const payload = isUpdate ? { ...currentReservation, ...values } : values;
  
    fetch(endpoint, {
      method: method,
      headers: headers,
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        // Handle success
        setSubmissionMessage(data.message);
        setCurrentReservation(data); // Update state with new/current reservation data
        resetForm();
      } else {
        // Handle potential error message from API
        throw new Error('Failed to process reservation');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setSubmissionMessage(error.message || 'Failed to create/update reservation. Please try again.');
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  const handleClearForm = (resetForm) => {
    resetForm();
    setSubmissionMessage('');
    setGuests(1); // Resetting guests back to initial value
    setIsMaxCapacity(false); // Resetting capacity warning back to initial state
  };

  const handleGuestChange = (event) => {
    const selectedGuests = Number(event.target.value);
    if (selectedGuests > maxGuests) {
      setIsMaxCapacity(true);
    } else {
      setIsMaxCapacity(false);
      setGuests(selectedGuests);
    }
  };
  
  return (
      <div>
          <h2>Make a Reservation</h2>
          {submissionMessage && <div className="submission-message">{submissionMessage}</div>}
          <Formik
                  initialValues={{
                  name: '',
                  lastname: '',
                  email: '',
                  password: '', 
                  phonenumber: '',
                  date: '',
                  time: '',
                  guests: '',
                  menuItems: [],
                  specialNotes: '',
              }}
              validate={validate} // Here you pass the validate function to Formik
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
                <label htmlFor="password">Password</label>
                <Field id="password" name="password" type="password" />
                <ErrorMessage name="password" component="div" className="field-error" />
            </div>

            <div className="form-field">
              <label htmlFor="phonenumber">Phone Number</label>
              <Field id="phonenumber" name="phonenumber" placeholder="Your Phone Number" />
              <ErrorMessage name="phonenumber" component="div" className="field-error" />
            </div>

            <div className="form-field">
              <label htmlFor="date">Date</label>
              <ReactDatePicker
                selected={(values.date && new Date(values.date)) || null}
                onChange={date => setFieldValue('date', date)}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                className="form-control"
                name="date"
              />
              <ErrorMessage name="date" component="div" className="field-error" />
            </div>

            <div className="form-field">
              <label htmlFor="time">Time</label>
              <Field as="select" id="time" name="time">
                {generateTimeSlots().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Field>
              <ErrorMessage name="time" component="div" className="field-error" />
            </div>

            <div className="form-field">
              <label htmlFor="guests">Number of Guests:</label>
              <select id="guests" name="guests" value={guests} onChange={handleGuestChange}>
                {[...Array(maxGuests)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} person{i > 0 ? 's' : ''}</option>
                ))}
              </select>
              <ErrorMessage name="guests" component="div" className="field-error" />
            </div>
            
            {isMaxCapacity && (
              <p className="capacity-message">Max Capacity is {maxGuests} currently, please select again</p>
            )}

            <div className="form-field">
              <label htmlFor="menuItems">Select Menu Items</label>
              <Field as="select" id="menuItems" name="menuItems" multiple={true} value={values.menuItems} onChange={event => {
                const options = event.target.options;
                const value = [];
                for (let i = 0, l = options.length; i < l; i++) {
                  if (options[i].selected) {
                    value.push(options[i].value);
                  }
                }
                setFieldValue('menuItems', value);
              }} style={{ height: "200px" }}>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))}
              </Field>
              <ErrorMessage name="menuItems" component="div" className="field-error" />
            </div>

            {/* Display selected menu items */}
            <div className="form-field">
              <h3>Selected Menu Items</h3>
              {values.menuItems.length > 0 ? (
                <ul>
                  {values.menuItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No items selected.</p>
              )}
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

    </div>
  );
};

export default ReservationForm;
