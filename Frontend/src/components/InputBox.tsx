type InputBoxProps = {
  label: string;
  set: (value: string) => void;
  type?: string;
  value?: string;
  placeholder?: string;
};

export const InputBox = ({ label, set, type = "text", value, placeholder }: InputBoxProps) => (
  <label className="block">
    <span className="mb-1 block text-sm font-semibold text-stone-200">{label}</span>
    <input
      value={value}
      onChange={(event) => set(event.target.value)}
      type={type}
      placeholder={placeholder}
      className="block w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-50 outline-none transition focus:border-amber-300"
      required
    />
  </label>
);
