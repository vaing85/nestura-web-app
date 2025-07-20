import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  owner?: { name: string; email: string };
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch property');
        setProperty(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div>
      <h2>{property.title}</h2>
      <p><strong>Address:</strong> {property.address}</p>
      <p><strong>Price:</strong> ${property.price}</p>
      <p>{property.description}</p>
      {property.owner && (
        <p><strong>Owner:</strong> {property.owner.name} ({property.owner.email})</p>
      )}
      {/* TODO: Show property images and reviews here */}
    </div>
  );
};

export default PropertyDetails;
