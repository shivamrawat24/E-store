import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineExclamation } from 'react-icons/hi';
import Button from './Button';

const ConfirmDialog = ({ open, title, description, confirmLabel = 'Delete', isLoading = false, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
              <HiOutlineExclamation className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
            {description && <p className="mt-1.5 text-sm text-gray-500">{description}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
