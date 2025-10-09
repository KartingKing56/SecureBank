import React, { useState } from "react";
import TransactionForm from "../components/Transaction/TransactionForm";
import '../css/TransactionPage/TransactionPage.css';

const TransactionPage: React.FC = () => {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleStepClick = (selectedStep: number) => {
        setStep(selectedStep);
    };

    return (
        <div className="transaction-page">
            <div className="transaction-card">
                <div className="step-header">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={`step ${step === s ? "active" : step > s ? "completed" : ""}`}
                            onClick={() => handleStepClick(s)}
                        >
                            Step {s}
                        </div>
                    ))}
                </div>

                <div className="form-content fade-in">
                    <TransactionForm step={step} />
                </div>

                <div className="button-group">
                    {step > 1 && (
                        <button className="btn-back" onClick={handleBack}>
                            Back
                        </button>
                    )}
                    {step < 5 && (
                        <button className="btn-proceed" onClick={handleNext}>
                            Proceed
                        </button>
                    )}
                    {step === 5 && <button className="btn-done">Done</button>}
                </div>
            </div>
        </div>
    );
};

export default TransactionPage;
