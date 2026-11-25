import { IoClipboardOutline } from 'react-icons/io5';

interface PasteButtonProps {
  onClick: () => void;
  className?: string
}

export default function PasteButton({onClick, className} : PasteButtonProps) {
  return (
  <button 
    type="button" 
    onClick={onClick}
    className={className}
  >
    <IoClipboardOutline 
      className={className && `${className}-icon`}
    />
  </button>
  );
}
