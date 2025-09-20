import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

// Error Boundary for Chart
class ChartErrorBoundary extends React.Component {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <div className="text-red-600 p-4">Failed to render chart. Please try again.</div>;
		}
		return this.props.children;
	}
}

const Result = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { predictionResult, riskScore, approvalProbability } = location.state || {};

	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		if (!predictionResult || !riskScore || !approvalProbability) {
			navigate(-1);
		} else {
			setTimeout(() => setShowContent(true), 300);
		}
	}, [predictionResult, riskScore, approvalProbability, navigate]);

	const closePage = () => {
		navigate(-1);
	};

	const generateGraphData = (userRisk, userProb) => {
		const labels = Array.from({ length: 11 }, (_, i) => i * 10);
		const dataPoints = labels.map((risk) => {
			return 100 / (1 + Math.exp(0.1 * (risk - 50)));
		});

		return {
			labels,
			datasets: [
				{
					label: 'Approval Probability (%) vs Risk Score',
					data: dataPoints,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.4,
				},
				{
					label: 'Your Position',
					data: labels.map((r) => (Math.abs(r - Math.round(userRisk)) < 5 ? userProb * 100 : null)),
					pointBackgroundColor: 'rgb(255, 99, 132)',
					pointBorderColor: 'rgb(255, 99, 132)',
					pointRadius: 6,
					showLine: false,
				},
			],
		};
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: { position: 'top' },
			title: {
				display: true,
				text: 'Risk Score vs Approval Probability',
			},
		},
		scales: {
			x: { title: { display: true, text: 'Risk Score' } },
			y: { title: { display: true, text: 'Approval Probability (%)' }, min: 0, max: 100 },
		},
	};

	if (!predictionResult || !riskScore || !approvalProbability) {
		return null;
	}

	const graphData = generateGraphData(riskScore, approvalProbability);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 relative">
			<button
				onClick={closePage}
				className="absolute top-4 right-4 text-3xl font-bold text-gray-600 hover:text-gray-800 focus:outline-none transition-transform duration-300 hover:scale-110"
				aria-label="Close"
			>
				&times;
			</button>

			<div
				className={`flex flex-col items-center w-full max-w-3xl p-6 bg-white rounded-2xl shadow-2xl transition-all duration-1000 ease-out ${
					showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'
				}`}
			>
				<h1 className="text-4xl font-extrabold text-indigo-800 mb-6 animate-bounce">
					Loan Prediction Result
				</h1>

				<div
					className={`w-full space-y-6 transition-all duration-700 delay-300 ${
						showContent ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<div
						className={`p-6 rounded-xl font-bold text-2xl text-center shadow-md transform transition-transform duration-500 hover:scale-105 ${
							predictionResult === 'Approved'
								? 'bg-green-200 text-green-900'
								: 'bg-red-200 text-red-900'
						}`}
					>
						Loan Status: {predictionResult}
					</div>
					<div className="p-6 bg-blue-200 text-blue-900 rounded-xl font-bold text-2xl text-center shadow-md transform transition-transform duration-500 hover:scale-105">
						Calculated Risk Score: {riskScore}
					</div>
					<div className="p-6 bg-indigo-200 text-indigo-900 rounded-xl font-bold text-2xl text-center shadow-md transform transition-transform duration-500 hover:scale-105">
						Probability of Approval: {(approvalProbability * 100).toFixed(2)}%
					</div>

					<div className="mt-8 p-4 bg-gray-50 rounded-xl shadow-inner">
						<ChartErrorBoundary>
							<Line data={graphData} options={chartOptions} />
						</ChartErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Result;