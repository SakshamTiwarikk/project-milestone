"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Department = {
  id: number;
  name: string;
  product_count: number;
};

export default function DepartmentsList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/departments");
        const data = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) return <div>Loading departments...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      <ul className="space-y-2">
        {departments.map((dept) => (
          <li key={dept.id}>
            <Link
              href={`/departments/${dept.id}`}
              className="text-blue-600 hover:underline"
            >
              {dept.name} ({dept.product_count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
