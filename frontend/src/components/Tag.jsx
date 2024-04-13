import React, { useState } from 'react';
import '../assets/css/tag.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Tag = ({tags, setTags}) => {
  const [inputValue, setInputValue] = useState('');
  const maxTags = 3;

  const createTag = () => {
    return tags.map((tag, index) => (
      <li key={index}>
        {tag} <i onClick={() => remove(tag)}>
          <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
        </i>
      </li>
    ));
  };

  const remove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTag = (e) => {
    if (e.key === 'Enter') {
      const newTags = e.target.value.replace(/\s+/g, ' ').split(',');
      const filteredTags = newTags.filter(tag => tag.trim().length > 1 && !tags.includes(tag.trim()));
      
      if (filteredTags.length > 0) {
        const updatedTags = [...tags, ...filteredTags];
        setTags(updatedTags.slice(0, maxTags));
      }
      
      setInputValue('');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const removeAllTags = () => {
    setTags([]);
  };

  return (
    <div className="wrapper">
      <div className="title">
        <h4>Tags</h4>
      </div>
      <div className="content">
        <p>Press enter or add a comma after each tag</p>
        <ul>
          {createTag()}
          {tags.length < 3 && <input 
            type="" 
            spellCheck="false" 
            value={inputValue} 
            onChange={handleInputChange} 
            onKeyDown={addTag} 
          />}
        </ul>
      </div>
      <div className="details">
        <p><span>{tags.length}</span>/{maxTags}</p>
        <button className='btn btn-danger' onClick={removeAllTags}>Remove All</button>
      </div>
    </div>
  );
};

export default Tag;
