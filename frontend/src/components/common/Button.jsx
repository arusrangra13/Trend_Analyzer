import React from 'react';

export default function Button(props) {
  return (
    <div className="comp-Button">
      {/* Button Component */}
      {props.children || 'Button'}
    </div>
  );
}
