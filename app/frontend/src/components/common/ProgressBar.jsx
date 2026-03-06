import React from 'react';

const ProgressBar = ({ currentStep, totalSteps = 7 }) => {
    return (
        <div className="w-full px-4 py-2 bg-white">
            {/* Track */}
            <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                {/* Progress Bar */}
                <div
                    className="bg-[#3B82F6] h-1.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>

            {/* Step Indicator Text */}
            <p className="text-center text-xs text-[#6B7280] mt-1 font-medium italic">
                Passo {currentStep} de {totalSteps}
            </p>
        </div>
    );
};

export default ProgressBar;
