import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function SearchableSelect({ options, value, onChange, placeholder, className, required }: SearchableSelectProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Hidden input for HTML5 required validation */}
      <input 
        type="text" 
        required={required} 
        value={value} 
        onChange={() => {}} 
        className="opacity-0 absolute w-0 h-0 pointer-events-none" 
        tabIndex={-1} 
      />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between cursor-pointer SelectBox ${className}`}
      >
        <span className={!selectedOption ? 'text-slate-400' : 'text-slate-800'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden top-full left-0">
          <div className="p-3 border-b border-slate-100 flex items-center gap-2 text-slate-400 bg-slate-50">
            <Search className="w-4 h-4 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              className="w-full outline-none text-slate-700 bg-transparent text-sm"
              placeholder={isRTL ? "ابحث عن مدينة..." : "Search city..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`px-4 py-3 cursor-pointer transition-colors text-sm ${value === opt.value ? 'bg-amber-100 text-amber-900 border-s-4 border-amber-500 font-bold' : 'text-slate-700 hover:bg-slate-50 border-s-4 border-transparent'}`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-slate-500 text-center text-sm">
                {isRTL ? "لا توجد نتائج مطابقة" : "No results found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
