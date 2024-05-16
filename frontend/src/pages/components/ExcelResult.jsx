import React from 'react';

function ExcelResult({ excelColumns, excelRows, loading, setRows }) {
    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            {excelColumns.map((col) => (
                                <th key={col.key}>{col.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {excelRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {excelColumns.map((col) => (
                                    <td key={col.key}>
                                        <input
                                            type="text"
                                            value={row[col.key] || ''}
                                            onChange={(e) => {
                                                const newData = [...excelRows];
                                                newData[rowIndex][col.key] = e.target.value;
                                                setRows(newData);
                                            }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ExcelResult;
