import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import './TablePage.css'; // Import CSS for styling
import apiClient from '../api';

const TablePage = () => {
  const [tableData, setTableData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvFilename, setCsvFilename] = useState('participants.csv');

  const handleDownload = async (episode) => {
    try {
      const response = await apiClient.get(`/api/coordinator/participants?episode=${episode}`);
      console.log(episode)
      console.log(response.data)
      setCsvData(response.data);
      setCsvFilename(`${episode}-participants.csv`);
    //   document.getElementById('csv-download-link').click();
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };
useEffect(() => {
   const arr=csvData
   if(arr.length!==0)
   { 
    document.getElementById('csv-download-link').click();
   }
}, [csvData])

const fetchReports = async () => {
  try {
    const response = await apiClient.get('/api/admin/reports');
    setTableData(response.data);
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
};

useEffect(() => {
  fetchReports();
}, []);
  return (
    <div className="table-container">
      <h2 className="table-title">Participants Table</h2>
      <table className="participants-table">
        <thead>
          <tr>
            <th>Episode</th>
            <th>Date</th>
            <th>Categories</th>
            <th>Kishores</th>
            <th>Participant List</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.episode}</td>
              <td>{row.date}</td>
              <td>{row.totalCategories}</td>
              <td>{row.totalKishores}</td>
              <td>
                <button className="download-button" onClick={() => handleDownload(row.episode)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Hidden CSV Link to trigger download */}
      <CSVLink
        data={csvData}
        filename={csvFilename}
        className="hidden"
        id="csv-download-link"
      >
        Download CSV
      </CSVLink>
    </div>
  );
};

export default TablePage;