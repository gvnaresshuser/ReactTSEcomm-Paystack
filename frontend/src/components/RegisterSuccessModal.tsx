import { useEffect, useRef } from "react";
import { CheckCircle, X } from "lucide-react";
import ModalPortal from "./ModalPortal";

interface RegisterSuccessModalProps {
  name: string;
  email: string;
  onClose: () => void;
}

const RegisterSuccessModal = ({
  name,
  email,
  onClose,
}: RegisterSuccessModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <ModalPortal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top colorful section */}
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-6 py-8 text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-lg backdrop-blur-sm">
              <CheckCircle size={48} />
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Registration Successful!
            </h2>

            <p className="mt-2 text-sm text-green-50">
              Your account has been created successfully.
            </p>
          </div>

          {/* Close button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:scale-110 hover:bg-white/30"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* User details */}
          <div className="p-6">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Account Details
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500">Name</span>

                  <span className="text-sm font-semibold text-slate-800">
                    {name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500">Email</span>

                  <span className="break-all text-right text-sm font-semibold text-slate-800">
                    {email}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
              You can now login using your registered credentials.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl"
            >
              Continue to Login →
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default RegisterSuccessModal;
