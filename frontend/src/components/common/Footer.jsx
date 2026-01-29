import React from 'react';

export default function Footer(props) {
  return (
    <div className="comp-Footer">
      {/* Footer Component */}
      {props.children || 'Footer'}
    </div>
  );
}
