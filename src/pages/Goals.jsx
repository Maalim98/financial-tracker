function Goals() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Financial Goals</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Set New Goal</h2>
          {/* Add goal form will go here */}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Current Goals</h2>
          {/* Goals list will go here */}
        </div>
      </div>
    </div>
  );
}

export default Goals; 