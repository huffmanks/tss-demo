import MultipleSelectorCore, { type Option } from "@/components/custom/multiple-selector-core";

interface MultipleSelectorProps {
  options: Array<Option>;
  value: Array<Option>;
  onChange: () => void;
}

export default function MultipleSelector({ options, value, onChange }: MultipleSelectorProps) {
  return (
    <div className="w-full px-10">
      <MultipleSelectorCore
        defaultOptions={options}
        onChange={onChange}
        value={value}
        placeholder="Type something that does not exist in dropdowns..."
        creatable
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  );
}
