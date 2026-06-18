import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative bg-white rounded-3xl shadow-md w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-gray-light">
                <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-light transition-colors duration-300 text-gray-muted hover:text-brand-dark"
                  aria-label="Yopish"
                >
                  <X className="w-5 h-5" weight="bold" />
                </button>
              </div>
            )}
            <div className={title ? 'p-6' : 'p-6'}>
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-light transition-colors duration-300 text-gray-muted hover:text-brand-dark z-10"
                  aria-label="Yopish"
                >
                  <X className="w-5 h-5" weight="bold" />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
