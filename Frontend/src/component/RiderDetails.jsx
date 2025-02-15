import React from "react";
import { useSelector } from "react-redux";

const RiderDetails = () => {
  const { firstName, lastName } = useSelector((state) => state.captainAuth);
  const { ride } = useSelector((state) => state.ride);
  const editing = false
  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <img
          className="h-20 w-20 rounded-full object-cover"
          // src={profileImage}
          alt="Profile"
        />
        {editing ? (
          <input
            type="text"
            // value={updatedName}
            // onChange={(e) => setUpdatedName(e.target.value)}
            className="border p-2 rounded"
          />
        ) : (
          <h2 className="text-2xl font-semibold">
            {firstName} {lastName}
          </h2>
        )}
      </div>
      <div className="mt-6">
        {/* <h4 className="text-lg">Rides Completed: {ridesCompleted}</h4> */}
        <h4 className="text-lg">Total Earnings: ₹{ride?.fare}</h4>
      </div>
      {editing ? (
        <button
          // onClick={handleSave}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      ) : (
        <button
          // onClick={() => setEditing(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default RiderDetails;
