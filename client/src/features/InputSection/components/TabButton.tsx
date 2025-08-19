interface Props {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ isSelected, onClick, children }: Props) => {
  return (
    <button
      className={`
        px-2.5 py-1 text-sm bg-transparent cursor-pointer transition-all duration-200 outline-none focus:outline-none
        ${
          isSelected
            ? "text-white border-b-2 border-b-white border-x-0 border-t-0 border-solid"
            : "text-white/60 hover:text-white/80 border-b-2 border-b-transparent border-x-0 border-t-0 border-solid"
        }
      `}
      type="button"
      onClick={onClick}>
      {children}
    </button>
  );
};

// border-[#058b9b]

export default TabButton;
