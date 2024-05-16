import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ExcelResult from './ExcelResult';
import 'react-quill/dist/quill.snow.css';

const API_URL = 'http://localhost:5000';

const updateFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/update_file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const downloadFile = async (fileName) => {
    const response = await axios.get(`${API_URL}/download_excel/${fileName}`, {
        responseType: 'blob',
    });
    return response.data;
};

function ExcelManager() {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExcelFile();
    }, []);

    const fetchExcelFile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/static/file.xlsx`, { responseType: 'arraybuffer' });
            processExcelBuffer(response.data);
        } catch (error) {
            console.error('Error fetching Excel file:', error);
        } finally {
            setLoading(false);
        }
    };

    const processExcelBuffer = (arrayBuffer) => {
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = excelData[0].map((col, index) => ({
            key: index.toString(),
            name: col.toString(),
            editable: true,
            resizable: true,
            width: 150,
        }));
        const rowsData = excelData.slice(1).map((row) =>
            row.reduce((rowData, cell, index) => {
                rowData[headers[index].key] = cell;
                return rowData;
            }, {})
        );
        setColumns(headers);
        setRows(rowsData);
    };

    const handleFileUpdate = async () => {
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const updatedFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([new Uint8Array(updatedFile.split('').map((c) => c.charCodeAt(0)))], {
            type: 'application/octet-stream',
        });
        const updatedFileObj = new File([blob], 'file.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        setLoading(true);
        await updateFile(updatedFileObj);
        setLoading(false);
        alert('File updated successfully');
    };

    const handleFileDownload = async () => {
        setLoading(true);
        const fileData = await downloadFile('file.xlsx');
        const url = window.URL.createObjectURL(new Blob([fileData]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
        setLoading(false);
    };

    const handleSave = async () => {
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const updatedFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([new Uint8Array(updatedFile.split('').map((c) => c.charCodeAt(0)))], {
            type: 'application/octet-stream',
        });
        const updatedFileObj = new File([blob], 'file.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        setLoading(true);
        await updateFile(updatedFileObj);
        setLoading(false);
        alert('File saved successfully');
    };

    return (
        <div>
            <h1>Excel File Manager</h1>
            <button onClick={handleFileUpdate} disabled={loading}>Update File</button>
            <button onClick={handleFileDownload} disabled={loading}>Download File</button>
            <button onClick={handleSave} disabled={loading}>Save</button>
            {loading && <p>Loading...</p>}
            <ExcelResult
                excelColumns={columns}
                excelRows={rows}
                loading={loading}
                setRows={setRows}
            />
        </div>
    );
}

export default ExcelManager;
