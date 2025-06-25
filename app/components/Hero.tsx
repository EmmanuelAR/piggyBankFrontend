interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Save{" "}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                smarter
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Piggy Bank helps you reach your financial goals with smart saving
              tools, expense tracking, and personalized planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </button>
              <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:border-green-500 hover:text-green-400 transition-all duration-200">
                See Demo
              </button>
            </div>
          </div>
          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl p-8 shadow-2xl border border-gray-600">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        Monthly Savings
                      </span>
                      <span className="text-green-400">+15%</span>
                    </div>
                    <div className="text-2xl font-bold text-white">$2,450</div>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        Goal Progress
                      </span>
                      <span className="text-green-400">75%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Upcoming Goals
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Vacation</span>
                      <span className="text-green-400 font-semibold">
                        $1,200 / $2,000
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Emergency Fund</span>
                      <span className="text-green-400 font-semibold">
                        $3,500 / $5,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative background */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-700 rounded-full opacity-20 blur-2xl z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-green-900 rounded-full opacity-20 blur-2xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
