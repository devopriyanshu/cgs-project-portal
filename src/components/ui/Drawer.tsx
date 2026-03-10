// src/components/ui/Drawer.tsx
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  side?: 'right' | 'left';
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  side = 'right',
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onOpenChange(false)}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className={cn(
                    'fixed top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl',
                    side === 'right' ? 'right-0' : 'left-0',
                    className
                  )}
                  initial={{ x: side === 'right' ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: side === 'right' ? '100%' : '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                >
                  <div className="flex items-start justify-between border-b border-gray-100 p-5">
                    <div>
                      {title && (
                        <Dialog.Title className="font-display text-lg font-semibold italic text-cgs-forest">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-0.5 text-sm text-gray-500">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    <Dialog.Close className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                      <X size={16} />
                    </Dialog.Close>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5">{children}</div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
