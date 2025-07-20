
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  owner?: { name: string; email: string };
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch properties');
        setProperties(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div>
      <h2>Properties</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {properties.map((property) => (
          <li key={property._id}>
            <Link to={`/properties/${property._id}`}><strong>{property.title}</strong></Link> - {property.address} - ${property.price}
            <br />
            {property.description}
            <br />
            {property.owner && (
              <span>Owner: {property.owner.name} ({property.owner.email})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Properties;
