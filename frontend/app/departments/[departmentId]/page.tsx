"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  brand: string;
  retail_price: number;
};

type Department = {
  id: number;
  name: string;
};

export default function DepartmentProductsPage() {
  const { departmentId } = useParams();
  const [department, setDepartment] = useState<Department | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const [deptRes, prodRes] = await Promise.all([
          fetch(`http://localhost:5000/api/departments/${departmentId}`),
          fetch(
            `http://localhost:5000/api/departments/${departmentId}/products`
          ),
        ]);

        if (!deptRes.ok || !prodRes.ok) {
          setNotFound(true);
          return;
        }

        const dept = await deptRes.json();
        const prods = await prodRes.json();

        setDepartment(dept);
        setProducts(prods);
      } catch (err) {
        console.error("Error fetching department page:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [departmentId]);

  if (loading) return <div>Loading...</div>;
  if (notFound || !department) return <div>Department not found.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {department.name} ({products.length} products)
        </h1>
        <Link href="/departments" className="text-blue-500 hover:underline">
          &larr; Back to Departments
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products in this department.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded shadow">
              <h2 className="font-semibold">{product.name}</h2>
              <p>Brand: {product.brand}</p>
              <p>Price: ₹{product.retail_price}</p>
              <Link
                href={`/products/${product.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Product →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
