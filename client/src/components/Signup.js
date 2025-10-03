import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

export const Signup = () => {
  const [customers, setCustomers] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);

  // fetch customers when component loads or refreshPage changes
  useEffect(() => {
    fetch("http://127.0.0.1:5555/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, [refreshPage]);

  // validation schema
  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    name: yup.string().required("Must enter a name").max(15),
    age: yup
      .number()
      .positive()
      .integer()
      .required("Must enter age")
      .typeError("Please enter an Integer")
      .max(125),
  });

  // formik hook
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      age: "",
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("http://127.0.0.1:5555/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      })
        .then((res) => {
          if (res.ok) {
            alert(`Customer ${values.name} added successfully!`);
            setRefreshPage(!refreshPage); // refresh customer list
            resetForm(); // clear form
          } else {
            alert("Error submitting form");
          }
        })
        .catch((err) => console.error("Error:", err));
    },
  });

  return (
    <div style={{ margin: "30px" }}>
      <h1>Customer sign up form</h1>

      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <br />
        <input
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <p style={{ color: "red" }}>{formik.errors.email}</p>

        <label htmlFor="name">Name</label>
        <br />
        <input
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <p style={{ color: "red" }}>{formik.errors.name}</p>

        <label htmlFor="age">Age</label>
        <br />
        <input
          id="age"
          name="age"
          onChange={formik.handleChange}
          value={formik.values.age}
        />
        <p style={{ color: "red" }}>{formik.errors.age}</p>

        <button type="submit">Submit</button>
      </form>

      <h2>Customers List</h2>
      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="3">No customers yet</td>
            </tr>
          ) : (
            customers.map((customer, i) => (
              <tr key={i}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.age}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
