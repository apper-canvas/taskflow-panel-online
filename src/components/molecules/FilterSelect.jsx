import Select from '@/components/atoms/Select';

const FilterSelect = ({ label, value, onChange, options, className = '' }) => (
  <Select
    aria-label={label}
    value={value}
    onChange={onChange}
    options={options}
    className={className}
  />
);

export default FilterSelect;