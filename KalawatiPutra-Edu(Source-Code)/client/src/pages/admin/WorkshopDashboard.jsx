// File: client/src/pages/admin/WorkshopDashboard.jsx
import React, { useState } from 'react';
import WorkshopForm from '../../components/admin/WorkshopForm';
import WorkshopList from '../../components/admin/WorkshopList';

const WorkshopDashboard = () => {
  const [workshops, setWorkshops] = useState([]);

  const handleWorkshopCreated = (newWorkshop) => {
    setWorkshops([newWorkshop, ...workshops]);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl overflow-hidden border border-gray-700 h-full flex flex-col">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Admin Workshop Dashboard</h1>
        <div className="grid gap-6">
          <WorkshopForm onWorkshopCreated={handleWorkshopCreated} />
          <WorkshopList />
        </div>
      </div>
    </div>
  );
};

export default WorkshopDashboard;