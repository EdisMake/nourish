import React from 'react';
import './Item.css';

const Item = ({ item }) => {
  return (
    <div className="item">
      <img src={item.imageUrl} alt={item.title} />
      <h2 className="item-text">{item.title}</h2>
      <p className="item-text">{item.recipe}</p>
    </div>
  );
}

export default Item;
