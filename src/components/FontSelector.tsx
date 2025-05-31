
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Type } from 'lucide-react';

const fonts = [
  { name: 'Sans Serif (Default)', value: 'font-sans', class: 'font-sans' },
  { name: 'Times New Roman', value: 'font-times', class: 'font-times' },
  { name: 'Calibri', value: 'font-calibri', class: 'font-calibri' },
  { name: 'Inter', value: 'font-inter', class: 'font-inter' },
  { name: 'Roboto', value: 'font-roboto', class: 'font-roboto' },
  { name: 'Open Sans', value: 'font-open-sans', class: 'font-open-sans' },
  { name: 'Lato', value: 'font-lato', class: 'font-lato' },
  { name: 'Source Sans Pro', value: 'font-source-sans', class: 'font-source-sans' },
  { name: 'Montserrat', value: 'font-montserrat', class: 'font-montserrat' },
  { name: 'Poppins', value: 'font-poppins', class: 'font-poppins' },
  { name: 'Nunito', value: 'font-nunito', class: 'font-nunito' },
  { name: 'Playfair Display', value: 'font-playfair', class: 'font-playfair' },
  { name: 'Merriweather', value: 'font-merriweather', class: 'font-merriweather' },
];

const FontSelector = () => {
  const [selectedFont, setSelectedFont] = useState('font-sans');

  useEffect(() => {
    // Apply the selected font to the entire document
    document.documentElement.className = selectedFont;
  }, [selectedFont]);

  const handleFontChange = (value: string) => {
    setSelectedFont(value);
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 border">
      <div className="flex items-center gap-2 min-w-[200px]">
        <Type className="h-4 w-4 text-gray-600" />
        <Select value={selectedFont} onValueChange={handleFontChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-60 overflow-y-auto">
            {fonts.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                className={`${font.class} hover:bg-gray-100`}
              >
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FontSelector;
