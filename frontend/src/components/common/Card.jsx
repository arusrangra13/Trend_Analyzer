import React from 'react';

export default function Card(props) {
  return (
    <div className="comp-Card">
      {/* Card Component */}
      {props.children || 'Card'}
    </div>
  );
}
