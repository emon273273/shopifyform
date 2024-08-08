import React, { useState, useEffect, useRef } from 'react';

const categories = {
  "Animals & Pet Supplies": ["Pet Food", "Pet Toys", "Pet Accessories"],
  "Apparel & Accessories": ["Clothing", "Shoes", "Jewelry"],
  "Arts & Entertainment": ["Books", "Music", "Movies"],
  "Baby & Toddler": ["Clothing", "Toys", "Baby Care"],
  "Business & Industrial": ["Office Supplies", "Industrial Equipment"],
  "Cameras & Optics": ["Cameras", "Lenses", "Accessories"],
  "Electronics": ["Phones", "Computers", "TVs"],
  "Food, Beverages & Tobacco": ["Snacks", "Beverages", "Cigarettes"],
  // Add more categories and subcategories as needed
};

const NestedDropdown = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showSubcategories, setShowSubcategories] = useState(false);
  const dropdownRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setShowSubcategories(true);
    if (categories[category].length === 0) {
      setIsOpen(false);
      setShowSubcategories(false);
      if (onSelect) {
        onSelect(category);
      }
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsOpen(false);
    setShowSubcategories(false);
    if (onSelect) {
      onSelect(`${selectedCategory} > ${subcategory}`);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setShowSubcategories(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      <button
        onClick={toggleDropdown}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        {selectedSubcategory || selectedCategory || 'Select category'}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 mt-2 rounded shadow-lg">
          {!showSubcategories && (
            <ul>
              {Object.keys(categories).map((category) => (
                <li key={category}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCategoryClick(category); }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showSubcategories && (
            <ul>
              {categories[selectedCategory].map((subcategory) => (
                <li key={subcategory}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSubcategoryClick(subcategory); }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    {subcategory}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSubcategories(false); }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Back
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NestedDropdown;
