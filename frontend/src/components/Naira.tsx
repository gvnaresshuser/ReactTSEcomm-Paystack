const Naira = ({ size = 18, className = "" }) => (
  <span style={{ fontSize: size }} className={`font-semibold ${className}`}>
    ₦
  </span>
);
export default Naira;
export const NairaIcon = () => <span className="text-lg font-bold">₦</span>;