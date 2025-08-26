interface Props {
  children: string;
  onChange: (bool: boolean) => void;
  checked: boolean;
}

const CheckBox = ({ children, onChange, checked }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    onChange(newValue);
  };

  return (
    <div className="flex flex-row px-2 py-1">
      <label className="paragraph" htmlFor={children}>
        <input
          type="checkbox"
          className="mr-2"
          id={children}
          name={children}
          checked={checked}
          onChange={handleChange}
        />
        {children}
      </label>
    </div>
  );
};

export default CheckBox;
