/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from './useUser';
import { XIcon, CreditCardIcon } from './icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
}

type Plan = 'subscription' | 'topup';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, triggerReason }) => {
    const { addCredits } = useUser();
    const [selectedPlan, setSelectedPlan] = useState<Plan>('subscription');

    const handlePurchase = (credits: number) => {
        addCredits(credits);
        onClose();
    };

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                aria-modal="true"
                role="dialog"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden"
                >
                    <div className="p-6">
                         <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900">Out of Credits</h2>
                                <p className="text-gray-600 mt-1">
                                    {triggerReason || 'You need more credits to continue.'}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <XIcon className="w-6 h-6"/>
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 flex flex-col gap-6">
                        {/* Toggle */}
                        <div className="w-full bg-gray-200 rounded-full p-1 flex">
                            <button
                                onClick={() => setSelectedPlan('subscription')}
                                className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${selectedPlan === 'subscription' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:bg-gray-300/50'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setSelectedPlan('topup')}
                                className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${selectedPlan === 'topup' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:bg-gray-300/50'}`}
                            >
                                Top Up
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {selectedPlan === 'subscription' ? (
                                <motion.div
                                    key="subscription"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                                        <h3 className="text-lg font-bold text-gray-900">Pro Plan</h3>
                                        <p className="text-sm text-gray-500">Best value for frequent users</p>
                                        <p className="text-4xl font-bold my-4 text-gray-900">$10<span className="text-base font-normal text-gray-500">/mo</span></p>
                                        <p className="text-lg font-semibold text-gray-800">100 Credits</p>
                                        <p className="text-sm text-gray-500">Credits reset monthly</p>
                                        <button 
                                            onClick={() => handlePurchase(100)}
                                            className="mt-6 w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95"
                                        >
                                            <CreditCardIcon className="w-5 h-5 mr-2" />
                                            Subscribe Now
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="topup"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <button onClick={() => handlePurchase(20)} className="w-full text-left flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-800 transition-colors">
                                        <div>
                                            <p className="font-semibold text-gray-900">20 Credits</p>
                                            <p className="text-sm text-gray-500">Quick top up</p>
                                        </div>
                                        <p className="font-bold text-gray-900">$5</p>
                                    </button>
                                    <button onClick={() => handlePurchase(50)} className="w-full text-left flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-800 transition-colors">
                                        <div>
                                            <p className="font-semibold text-gray-900">50 Credits</p>
                                            <p className="text-sm text-gray-500">Great value</p>
                                        </div>
                                        <p className="font-bold text-gray-900">$10</p>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                     <div className="p-4 bg-gray-100/50 text-center text-xs text-gray-500 border-t">
                        This is a demo. No real payment will be processed.
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default PaymentModal;