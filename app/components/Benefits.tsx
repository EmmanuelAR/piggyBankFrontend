export default function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-10">
          Benefits of saving with{" "}
          <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Piggy Bank
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-700">
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Personalized Goals
            </h3>
            <p className="text-gray-300">
              Set your own savings goals and track your progress visually and
              easily.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-700">
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Expense Tracking
            </h3>
            <p className="text-gray-300">
              Monitor your expenses and discover new ways to save every month.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-700">
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Financial Insights
            </h3>
            <p className="text-gray-300">
              Get personalized tips and insights to improve your financial
              habits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
