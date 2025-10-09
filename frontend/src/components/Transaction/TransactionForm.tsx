import React from "react";
import "../../css/TransactionPage/TransactionPage.css";

interface TransactionFormProps {
    step: number;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ step }) => {
    switch (step) {
        case 1:
            return (
                <div className="form-section">
                    <h2>Amount Details / Payment</h2>

                    <label htmlFor="transactionAmount">Transaction Amount</label>
                    <input id="transactionAmount" name="transactionAmount" type="number" placeholder="R 0.00" />

                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" title="Select currency type">
                        <option>South African Rand (R)</option>
                        <option>US Dollar ($)</option>
                        <option>Euro (€)</option>
                    </select>

                    <label htmlFor="provider">Provider</label>
                    <select id="provider" name="provider" title="Select payment provider">
                        <option>SWIFT</option>
                        <option>Visa</option>
                        <option>Mastercard</option>
                    </select>

                    <div className="terms">
                        <input type="checkbox" id="terms" />
                        <label htmlFor="terms">I agree to Cashmate Terms of Use</label>
                    </div>
                </div>
            );

        case 2:
            return (
                <div className="form-section">
                    <h2>Sender Details</h2>
                    <label>Sender Name</label>
                    <input type="text" placeholder="Mark Henry" />
                    <label>Account Number</label>
                    <input type="text" placeholder="1234567890123" />
                    <label>Bank Name</label>
                    <input type="text" placeholder="Standard Bank" />
                </div>
            );

        case 3:
            return (
                <div className="form-section">
                    <h2>Beneficiary Details</h2>
                    <label>Beneficiary Name</label>
                    <input type="text" placeholder="John Doe" />
                    <label>Account Number</label>
                    <input type="text" placeholder="1234567890123" />
                    <label>Bank Name</label>
                    <input type="text" placeholder="Absa" />
                </div>
            );

        case 4:
            return (
                <div className="form-section">
                    <h2>Review</h2>
                    <div className="review-box">
                        <div className="review-section">
                            <h4>From</h4>
                            <p>Mark Henry</p>
                            <p>Standard Bank</p>
                            <p>1234567890123</p>
                        </div>
                        <div className="review-section">
                            <h4>To</h4>
                            <p>John Doe</p>
                            <p>Absa</p>
                            <p>1234567890123</p>
                        </div>
                        <div className="review-section">
                            <h4>Amount</h4>
                            <p>R 0.00</p>
                            <h4>Provider</h4>
                            <p>SWIFT</p>
                        </div>
                    </div>
                </div>
            );

        case 5:
            return (
                <div className="form-section confirmation">
                    <h2>Payment Submitted</h2>
                    <p>Reference - <strong>TXN2025000123</strong></p>
                </div>
            );

        default:
            return null;
    }
};

export default TransactionForm;
