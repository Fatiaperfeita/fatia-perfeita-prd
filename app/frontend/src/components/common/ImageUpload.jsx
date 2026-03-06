import React, { useRef } from 'react';

const ImageUpload = ({ label, value, onChange, onRemove, previewUrl }) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
        // Reset input so the same file can be selected again if removed
        e.target.value = '';
    };

    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-[14px] font-semibold text-slate-500 ml-1">
                    {label}
                </label>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {!previewUrl ? (
                /* Upload Placeholder Button */
                <button
                    onClick={handleButtonClick}
                    className="w-full h-16 flex items-center justify-center gap-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold active:bg-slate-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Escolher arquivo
                </button>
            ) : (
                /* Preview State */
                <div className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">
                            {value?.name || 'Imagem selecionada'}
                        </p>
                        <button
                            onClick={onRemove}
                            className="mt-1 text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 active:scale-95 transition-all"
                        >
                            Remover ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
