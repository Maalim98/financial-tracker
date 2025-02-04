import ExpenseForm from '../components/forms/ExpenseForm';

function Expenses() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Manage Expenses</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your daily expenses</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Add New Expense
        </h2>
        <ExpenseForm />
      </div>

      {/* Expense list will be added later */}
    </div>
  );
}

export default Expenses; 