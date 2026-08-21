"use client";

import { useState } from "react";
import { addTreatment, toggleTreatmentStatus, deleteTreatment } from "@/app/admin/services/actions";

type Treatment = {
  id: string;
  categoryId: string;
  name: string;
  durationMinutes: number;
  price: string;
  image?: string | null;
  active: boolean;
};

type CategoryWithTreatments = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
  treatments: Treatment[];
};

type Category = {
  id: string;
  name: string;
};

export default function ServicesManager({
  categoriesWithTreatments,
  allCategories
}: {
  categoriesWithTreatments: CategoryWithTreatments[];
  allCategories: Category[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: allCategories[0]?.id || "",
    durationMinutes: 30,
    price: "",
    image: "",
  });

  const handleAddTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Generate an ID (e.g., "herreklip-2")
    const id = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    
    await addTreatment({
      id,
      ...formData
    });
    
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ ...formData, name: "", price: "", image: "" }); // Reset form
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleTreatmentStatus(id, currentStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Er du sikker på, at du vil slette denne behandling?")) {
      await deleteTreatment(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700"
        >
          Tilføj Behandling
        </button>
      </div>

      <div className="space-y-6">
        {categoriesWithTreatments.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Ingen Kategorier Endnu</h2>
            <p className="mt-2 text-sm text-gray-500">Du har endnu ikke oprettet nogen services.</p>
          </div>
        ) : (
          categoriesWithTreatments.map((category) => (
            <div key={category.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                )}
              </div>
              
              {category.treatments.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-gray-500">Ingen behandlinger i denne kategori.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-white text-xs uppercase text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-semibold">Behandling</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Varighed</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Pris</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-right">Handling</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {category.treatments.map((treatment) => (
                        <tr key={treatment.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium text-gray-900">{treatment.name}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {treatment.durationMinutes} min
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {treatment.price}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button 
                              onClick={() => handleToggle(treatment.id, treatment.active)}
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                treatment.active 
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                                  : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              {treatment.active ? 'Aktiv' : 'Inaktiv'}
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDelete(treatment.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Slet
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Tilføj Ny Behandling</h3>
            
            <form onSubmit={handleAddTreatment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Navn</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="f.eks. Herreklip"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Billede (URL)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="f.eks. /images/services/maskineklip-customer.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select 
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {allCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Varighed (min)</label>
                  <input 
                    type="number" 
                    required
                    step="5"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({...formData, durationMinutes: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pris</label>
                  <input 
                    type="text" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="f.eks. 250 kr."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Gemmer..." : "Gem Behandling"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
