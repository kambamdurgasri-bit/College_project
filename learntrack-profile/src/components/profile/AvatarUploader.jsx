import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload } from 'lucide-react';

export default function AvatarUploader({ preview, onFileSelect, size = 96, compact = false }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file, URL.createObjectURL(file));
  };

  return (
    <div className={`flex ${compact ? 'flex-col items-center' : 'items-center gap-5'}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="h-full w-full rounded-full bg-primary-gradient dark:bg-primary-gradient-dark p-1 shadow-glow dark:shadow-glowDark">
          <img
            src={preview}
            alt="Avatar preview"
            className="h-full w-full rounded-full object-cover bg-white dark:bg-dark-card"
          />
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary-gradient dark:bg-primary-gradient-dark text-white shadow-glow dark:shadow-glowDark ring-2 ring-white dark:ring-dark-card"
          aria-label="Change photo"
        >
          <Camera size={14} strokeWidth={2.4} />
        </motion.button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <div className={compact ? 'mt-4 text-center' : ''}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-dark-accent hover:text-secondary dark:hover:text-dark-primaryHover transition-colors"
        >
          <Upload size={14} /> Upload new photo
        </button>
        <p className="text-xs text-textSecondary dark:text-dark-textMuted mt-1">PNG or JPG, up to 5MB</p>
      </div>
    </div>
  );
}
