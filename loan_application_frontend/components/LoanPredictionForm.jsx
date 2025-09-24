// Updated LoanPredictionForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const initialState = {
	Age: "",
	AnnualIncome: "",
	Creditscore: "",
	EmploymentStatus: "",
	EducationLevel: "",
	LoanAmount: "",
	LoanDuration: "",
	CreditCardUtilizationRate: "",
	BankruptcyHistory: "false",
	PreviousLoanDefaults: "false",
	LengthOfCreditHistory: "",
	TotalLiabilities: "",
	NetWorth: "",
	InterestRate: "",
};

const LoanPredictionForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState(initialState);
	const [loading, setLoading] = useState(true);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch(`https://loan-prediction-model-eight.vercel.app/user/testdata/${id}`);
				if (response.ok) {
					const user = await response.json();
					setFormData({
						Age: user.Age ?? "",
						AnnualIncome: user.AnnualIncome ?? "",
						Creditscore: user.Creditscore ?? "",
						EmploymentStatus: user.EmploymentStatus ?? "",
						EducationLevel: user.EducationLevel ?? "",
						LoanAmount: user.LoanAmount ?? "",
						LoanDuration: user.LoanDuration ?? "",
						CreditCardUtilizationRate: user.CreditCardUtilizationRate ?? "",
						BankruptcyHistory: String(user.BankruptcyHistory ?? "false"),
						PreviousLoanDefaults: String(user.PreviousLoanDefaults ?? "false"),
						LengthOfCreditHistory: user.LengthOfCreditHistory ?? "",
						TotalLiabilities: user.TotalLiabilities ?? "",
						NetWorth: user.NetWorth ?? "",
						InterestRate: user.InterestRate ?? "",
					});
				} else {
					console.error("Failed to load test user data.");
				}
			} catch (err) {
				console.error("Error fetching user data:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [id]);

	const closePage = () => {
		navigate(-1);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const submissionData = {
			...formData,
			Age: parseInt(formData.Age, 10),
			AnnualIncome: parseFloat(formData.AnnualIncome),
			Creditscore: parseInt(formData.Creditscore, 10),
			LoanAmount: parseFloat(formData.LoanAmount),
			LoanDuration: parseInt(formData.LoanDuration, 10),
			CreditCardUtilizationRate: parseFloat(formData.CreditCardUtilizationRate),
			BankruptcyHistory: formData.BankruptcyHistory === "true",
			PreviousLoanDefaults: formData.PreviousLoanDefaults === "true",
			LengthOfCreditHistory: parseInt(formData.LengthOfCreditHistory, 10),
			TotalLiabilities: parseFloat(formData.TotalLiabilities),
			NetWorth: parseFloat(formData.NetWorth),
			InterestRate: parseFloat(formData.InterestRate),
		};

		try {
			const backendUrl = "https://loan-prediction-model-1.onrender.com/predict";
			const response = await fetch(backendUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(submissionData),
			});

			if (response.ok) {
				const result = await response.json();
				// Navigate to result page with state
				navigate("/result", {
					state: {
						predictionResult: result.result,
						riskScore: result.risk_score,
						approvalProbability: result.approval_probability,
					},
				});
			} else {
				const errorData = await response.json();
				console.error("Prediction API Error:", errorData.error);
				alert(`Error: ${errorData.error}`);
			}
		} catch (error) {
			console.error("Network error:", error);
			alert(
				"A network error occurred. Please check the console and ensure the backend is running."
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-white">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white py-4 relative">
			<button
				onClick={closePage}
				className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700 focus:outline-none"
				aria-label="Close"
			>
				&times;
			</button>

			<div className="flex flex-col items-center w-full max-w-sm p-4">
				<h2 className="text-[#0e141b] text-2xl font-bold text-center mb-1">
					Loan Prediction Form
				</h2>
				<p className="text-[#0e141b] text-base text-center mb-4">
					Review the details and click Predict.
				</p>
				<form className="w-full" onSubmit={handleSubmit}>
					{[
						{ name: "Age", placeholder: "Enter your age" },
						{ name: "AnnualIncome", placeholder: "Enter your annual income" },
						{ name: "Creditscore", placeholder: "Credit score (300-850)" },
						{ name: "LoanAmount", placeholder: "Loan amount" },
						{ name: "LoanDuration", placeholder: "Duration (months)" },
						{
							name: "CreditCardUtilizationRate",
							placeholder: "Utilization rate (0-100%)",
						},
						{
							name: "LengthOfCreditHistory",
							placeholder: "Credit history (years)",
						},
						{ name: "TotalLiabilities", placeholder: "Total liabilities" },
						{ name: "NetWorth", placeholder: "Net worth" },
						{ name: "InterestRate", placeholder: "Expected interest rate (%)" },
					].map((field) => (
						<div key={field.name} className="mb-3">
							<label className="block font-semibold text-gray-800 pb-1">
								{field.name.replace(/([A-Z])/g, " $1")}
							</label>
							<input
								type="number"
								name={field.name}
								placeholder={field.placeholder}
								className="w-full border rounded-md px-3 py-2 text-gray-700 bg-[#f8fafc]"
								value={formData[field.name]}
								disabled
								readOnly
							/>
						</div>
					))}
					<div className="mb-3">
						<label className="block font-semibold text-gray-800 pb-1">
							Employment Status
						</label>
						<select
							name="EmploymentStatus"
							value={formData.EmploymentStatus}
							disabled
							readOnly
							className="w-full border rounded-md px-3 py-2 bg-[#f8fafc]"
						>
							<option value="">Select</option>
							<option value="Employed">Employed</option>
							<option value="Self-Employed">Self-Employed</option>
							<option value="Unemployed">Unemployed</option>
							<option value="Retired">Retired</option>
							<option value="Student">Student</option>
						</select>
					</div>
					<div className="mb-3">
						<label className="block font-semibold text-gray-800 pb-1">
							Education Level
						</label>
						<select
							name="EducationLevel"
							value={formData.EducationLevel}
							disabled
							readOnly
							className="w-full border rounded-md px-3 py-2 bg-[#f8fafc]"
						>
							<option value="">Select</option>
							<option value="High School">High School</option>
							<option value="Associate">Associate Degree</option>
							<option value="Bachelor">Bachelor's Degree</option>
							<option value="Master">Master's Degree</option>
							<option value="PhD">PhD</option>
						</select>
					</div>
					<div className="mb-3">
						<label className="block font-semibold text-gray-800 pb-1">
							Bankruptcy History
						</label>
						<select
							name="BankruptcyHistory"
							value={formData.BankruptcyHistory}
							disabled
							readOnly
							className="w-full border rounded-md px-3 py-2 bg-[#f8fafc]"
						>
							<option value="false">No</option>
							<option value="true">Yes</option>
						</select>
					</div>
					<div className="mb-3">
						<label className="block font-semibold text-gray-800 pb-1">
							Previous Loan Defaults
						</label>
						<select
							name="PreviousLoanDefaults"
							value={formData.PreviousLoanDefaults}
							disabled
							readOnly
							className="w-full border rounded-md px-3 py-2 bg-[#f8fafc]"
						>
							<option value="false">No</option>
							<option value="true">Yes</option>
						</select>
					</div>
					<div className="flex px-4 py-3 justify-center">
						<button
							type="submit"
							disabled={isLoading}
							className={`flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 text-slate-50 text-sm font-bold transition-all ${
								isLoading
									? "bg-gray-400 cursor-not-allowed"
									: "bg-[#1978e5] hover:bg-[#1565c0]"
							}`}
						>
							{isLoading ? "Predicting..." : "Predict"}
						</button>
					</div>
				</form>

				{isLoading && (
					<div className="mt-6 flex flex-col items-center justify-center space-y-3">
						<div className="w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
						<p className="text-gray-600 text-sm">
							Analyzing loan application...
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default LoanPredictionForm;