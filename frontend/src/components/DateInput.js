// Component for date input
const DateInput = ({ label, value, onChange }) => (
    <div className="form-group">
        <label>{label}</label>
        <input
            type="date"
            className="form-control"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export default DateInput;

