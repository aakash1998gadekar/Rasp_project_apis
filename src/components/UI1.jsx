import "../App.css";
import React, { useCallback, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { baseURL } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {getAllStudent,addStudents} from '../apis/backend'
import 'bootstrap/dist/css/bootstrap.min.css';

const UI1 = ({ data }) => {
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState([]);
  const [showTable,setShowTable] = useState(true);
  const [stData,setStData]=useState({"student_name":"","student_batch_id":"","student_email_id":"","student_phone_number":"","student_roll_number":""});
  const onRowClicked = useCallback((editData) => {
    navigate(`/form/${editData.id}`)
    // eslint-disable-next-line
  }, []);
  


  const addStudent = () =>{
    // navigate("/form")
    console.log("adding student");
  
    setShowTable(false);
    console.log(showTable)
  }

  
  const deleteData = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/${id}`);
      
      // If deletion is successful, update the state (rowData)
      const res = await axios.get(`${baseURL}/api`);
      setRowData(res.data.data);
    } catch (error) {
      console.error("Error deleting data:", error);
      // Handle error as needed (e.g., show a notification)
    }
  };
  const actionButtons = (params) => {
    const value  = params.node.data; // Access row data
    if (!value) {
      return <div>Loading...</div>; // Display loading indicator while data fetches
    }
    return (
      <div>
        <button
          className="Edit-btn"
          onClick={() => onRowClicked(value)} // Pass row data to onRowClicked
          >
          Edit
        </button>
        <button className="Delete-btn" onClick={() => deleteData(value.id)}>
          Delete
        </button>
      </div>
    );
  };
  
  useEffect(() => {
    return () => {
      const headers = data.list.fields.map(
        (col) => {
          return {
            field: col.name,
            headerName: col.heading,
            sortable: col.sortable,
            flex: 1,
          };
        },
        [data]
      );
      
      setColDefs([
        ...headers,
        {
          field: "actions",
          headerName: "Actions",
          flex: 1,
          cellRenderer: actionButtons,
        },
      ]);
      // eslint-disable-next-line
    }}, []);
    
    
  //   useEffect(() => {
  //     // Fetch data when the component mounts
  //     const fetchData = async () => {
  //     try {
  //       const res = await axios.get(${baseURL}/api);
  //       setRowData(res.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       // Handle error as needed (e.g., show a notification)
  //     }
  //   };

  //   fetchData(); // Call the fetchData function
  // }, []); // Empty dependency array means this effect runs once when the component mounts

 

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const res = await getAllStudent();
        // Map row data to match column names
        console.log(res);
        const mappedRowData = res.map(row => ({
          name: row.student_name,
          roll_no: row.student_roll_number,
          email_id: row.student_email_id,
          phone_no: row.student_phone_number,
          gender: 'M', // This field is not present in the row data you provided
          current_in_status: 'In', // This field is not present in the row data you provided
          batch_id: row.student_batch_name
        }));
        setRowData(mappedRowData);
        setLoading(false); 
      } catch (error) { 
        console.error("Error fetching data:", error);
        setLoading(false);
        // Handle error as needed (e.g., show a notification)
      }
    };
  // 
    fetchData();
    // addStudent(); // Call the fetchData function
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // useEffect(() => {
  //   // Fetch data when the component mounts
  //   const addStudents = async () => {
  //     try {
  //       const res = await addStudents();
       
  //       // Map row data to match column names
  //       console.log(res);
  //       // const mappedRowData = res.map(row => ({
  //       //   name: row.student_name,
  //       //   roll_no: row.student_roll_number,
  //       //   email_id: row.student_email_id,
  //       //   phone_no: row.student_phone_number,
  //       //   gender: 'M', // This field is not present in the row data you provided
  //       //   current_in_status: 'In', // This field is not present in the row data you provided
  //       //   batch_id: row.student_batch_name
  //       // }));
  //       // setRowData(mappedRowData);
  //       // setLoading(false); 
  //     } catch (error) { 
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //       // Handle error as needed (e.g., show a notification)
  //     }
  //   };
  
  // //   // fetchData();
  //   // addStudents(); // Call the fetchData function
  // }, []); // 


  const handleSubmit = (event) => {
    setShowTable(true)
    console.log(showTable)
    event.preventDefault();
    addStudents(stData);
    // console.log(stData)
    // Handle form submission here
  };



  return (
    // wrapping container with theme & size
  <>
    {showTable ? (
      <div className="ag-theme-quartz App" style={{ width: "100%", height: "500px" }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
        <button className="student-btn" onClick={addStudent}>
          Add New Student
        </button>
      </div>
    ) : (
      <form onSubmit={handleSubmit} >
      <div className="form-group">
        <label htmlFor="student_name">Name:</label>
        <input type="text" className="form-control" id="student_name" name="student_name" 
        onChange={(e) =>
          setStData({ ...stData, [e.target.name]: e.target.value })
        }/>
      </div>
      <div className="form-group">
        <label htmlFor="student_batch_id">Batch ID:</label>
        <input type="text" className="form-control" id="student_batch_id" name="student_batch_id" 
        onChange={(e) =>
          setStData({ ...stData, [e.target.name]: e.target.value })
        }/>
      </div>
      <div className="form-group">
        <label htmlFor="student_email_id">Email:</label>
        <input type="email" className="form-control" id="student_email_id" name="student_email_id"
        onChange={(e) =>
          setStData({ ...stData, [e.target.name]: e.target.value })
        } />
      </div>
      <div className="form-group">
        <label htmlFor="student_phone_number">Phone Number:</label>
        <input type="text" className="form-control" id="student_phone_number" name="student_phone_number"
        onChange={(e) =>
          setStData({ ...stData, [e.target.name]: e.target.value })
        } />
      </div>
      <div className="form-group">
        <label htmlFor="student_roll_number">Roll Number:</label>
        <input type="text" className="form-control" id="student_roll_number" name="student_roll_number" 
        onChange={(e) =>
          setStData({ ...stData, [e.target.name]: e.target.value })
        }/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    )}
    </>
  );
};

export default UI1;