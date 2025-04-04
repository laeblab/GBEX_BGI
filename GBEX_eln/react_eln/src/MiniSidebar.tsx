import React, { CSSProperties } from 'react';
import { Button } from 'primereact/button';

interface MenuItem {
  icon: string;
  label: string;
}

interface MiniSidebarProps {
    expanded: boolean;
    onToggle: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const menuItems: MenuItem[] = [
  { icon: 'pi pi-home', label: 'Home' },
  { icon: 'pi pi-user', label: 'Profile' },
  { icon: 'pi pi-cog', label: 'Settings' },
];

const MiniSidebar: React.FC<MiniSidebarProps> = ({
    expanded,
    onToggle,
    onMouseEnter,
    onMouseLeave,
}) => {
  const sidebarWidth = expanded ? 250 : 60;
  const sidebarStyle: CSSProperties = {
      width: `${sidebarWidth}px`,
      height: '100vh',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      background: '#343a40',
      color: '#fff',
      position: 'relative',
      flexShrink: 0, // Ensure it does not shrink in the flex container
  };

  const headerStyle: CSSProperties = {
    padding: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    cursor: 'pointer',
  };

  const iconStyle: CSSProperties = {
    fontSize: '1.5rem',
  };

  const labelStyle: CSSProperties = {
    marginLeft: '10px',
    opacity: expanded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    whiteSpace: 'nowrap',
  };

  return (
      <div
            style={sidebarStyle}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={headerStyle}>
                {expanded ? 'My Application' : 'MA'}
            </div>
            {menuItems.map((item, index) => (
                <div key={index} style={itemStyle}>
                    <i className={item.icon} style={iconStyle}></i>
                    <span style={labelStyle}>{item.label}</span>
                </div>
            ))}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Button
                    icon={expanded ? 'pi pi-angle-left' : 'pi pi-angle-right'}
                    onClick={onToggle}
                    className="p-button-rounded p-button-text"
                />
            </div>
        </div>
  );
};

export default MiniSidebar;