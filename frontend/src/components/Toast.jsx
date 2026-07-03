import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const Toast = ({ toast }) => {
  if (!toast) return null;

  const isError = toast.type === "error";
  const Icon = isError ? FiXCircle : FiCheckCircle;

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm animate-fadeUp rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 ${isError ? "text-red-500" : "text-violet-600"}`} />
        <p className="text-sm font-black text-slate-800">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
