import { useState, useEffect } from 'react';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/testimonials')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch testimonials');
                }
                return res.json();
            })
            .then((data) => {
                setTestimonials(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching testimonials:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <section className="max-w-4xl mx-auto py-8 text-center">
            <h1 className="text-2xl font-semibold mb-6">What patients say</h1>
            {loading && <p className="text-gray-500">Loading testimonials...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {testimonials.length > 0 ? (
                <div className="space-y-6">
                    {testimonials.map((t, index) => (
                        <div key={index} className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
                            <p className="italic">"{t.testimonial}"</p>
                            <p className="text-right font-semibold mt-2">- {t.name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p className="text-gray-500">No testimonials yet.</p>
            )}
        </section>
    );
}
