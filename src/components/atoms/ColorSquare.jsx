const ColorSquare = ({ color, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-8 h-8 rounded-lg transition-all ${
      isSelected 
        ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
        : 'hover:scale-105'
    }`}
    style={{ backgroundColor: color }}
  />
);

export default ColorSquare;