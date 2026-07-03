type SubmitProps = {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
};

const Submit = ({ onClick, disabled = false, label = "Submit" }: SubmitProps) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded bg-amber-300 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
};

export default Submit;
