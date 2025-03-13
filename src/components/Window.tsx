import { useState, useRef, ReactNode, MouseEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import { WindowId, useWindowStore } from '@/utils/windowUtils';

interface WindowProps {
  id: WindowId;
  children: ReactNode;
}

const Window = ({
  id,
  children
}: WindowProps) => {
  const {
    windows,
    closeWindow,
    focusWindow,
    updateWindowPosition
  } = useWindowStore();
  
  const windowState = windows[id];
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({
    x: 0,
    y: 0
  });
  
  const windowRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!windowRef.current) return;
    
    const handleResize = () => {
      if (!windowRef.current) return;
      
      const rect = windowRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = windowState.position.x;
      let newY = windowState.position.y;
      
      if (newX + rect.width > viewportWidth) {
        newX = Math.max(0, viewportWidth - rect.width);
      }
      
      if (newY + rect.height > viewportHeight) {
        newY = Math.max(0, viewportHeight - rect.height);
      }
      
      if (newX !== windowState.position.x || newY !== windowState.position.y) {
        updateWindowPosition(id, { x: newX, y: newY });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [id, updateWindowPosition, windowState.position]);
  
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (!windowRef.current) return;
    
    focusWindow(id);
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: MouseEvent | any) => {
    if (!isDragging) return;
    
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = windowRef.current?.offsetWidth || windowState.size.width;
    const windowHeight = windowRef.current?.offsetHeight || windowState.size.height;
    
    newX = Math.max(0, Math.min(newX, viewportWidth - windowWidth));
    newY = Math.max(0, Math.min(newY, viewportHeight - windowHeight));
    
    updateWindowPosition(id, {
      x: newX,
      y: newY
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWindowClick = () => {
    if (!windowState.isFocused) {
      focusWindow(id);
    }
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  if (!windowState.isOpen) return null;
  
  return (
    <div 
      ref={windowRef} 
      className="win95-window absolute" 
      style={{
        left: `${windowState.position.x}px`,
        top: `${windowState.position.y}px`,
        width: `${windowState.size.width}px`,
        height: `${windowState.size.height}px`,
        zIndex: windowState.zIndex
      }} 
      onClick={handleWindowClick}
    >
      <div 
        onMouseDown={handleMouseDown} 
        className="win95-titlebar cursor-move font-pixel bg-blue-800"
      >
        <div className="text-sm font-bold">{windowState.title}</div>
        <div className="flex gap-1">
          <button 
            className="win95-button w-5 h-5 flex items-center justify-center p-0" 
            onClick={() => closeWindow(id)}
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <div 
        className="p-2 overflow-auto font-pixel" 
        style={{
          height: 'calc(100% - 28px)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Window;
