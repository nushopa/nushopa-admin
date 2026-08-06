import { useState } from "react";
import { FiLock, FiUnlock } from "react-icons/fi";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error,
  className = "",
  disabled = false,
  autoComplete = "off",
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-start text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`
            w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${isPassword ? "pr-10" : ""}
            ${ disabled ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed" : "hover:border-gray-400 dark:hover:border-gray-600" }
            ${error ? "border-red-500 bg-red-50 dark:bg-red-950/20 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="
              absolute inset-y-0 right-0 flex items-center px-3
              text-gray-500 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-200
              disabled:cursor-not-allowed disabled:opacity-50
              transition-colors duration-150
            "
          >
            {showPassword ? <FiUnlock size={16} /> : <FiLock size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export { InputField };
