// src/CsvData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CsvData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/csv-data/');
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

    return (
        <div>
            <h1>CSV Data</h1>
            <table>
                <thead>
                    <tr>
                        <th>Názov</th>
                        <th>Predajca</th>
                        <th>Cena</th>
                        <th>Plati do</th>
                        <th>Poznamka</th>
                        <th>Kategoria</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Názov}</td>
                            <td>{item.Predajca}</td>
                            <td>{item.Cena}</td>
                            <td>{item.Plati_do}</td>
                            <td>{item.Poznamka}</td>
                            <td>{item.Kategoria}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CsvData;
