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
      } catch (error) {
      }

      setSubmitting(false);
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
      {submissionStatus && <div>{submissionStatus}</div>}
    </div>
  );
};

export default ReservationForm;