import React from 'react';

export default function Modal(props) {
  return (
    <div className="comp-Modal">
      {/* Modal Component */}
      {props.children || 'Modal'}
    </div>
  );
}
