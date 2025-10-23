import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

/**
 * Category strip WITHOUT an "All" pill.
 * Clicking a category sets that filter. "View Menu" button resets it.
 * - Uniform circular thumbnails
 * - Clear selected state with orange ring
 * - Accessible (aria-selected + focus-visible)
 */
const ExploreMenu = ({ category, setCategory }) => {
  const onPick = (name) => setCategory(name);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our mission
        is to satisfy your cravings and elevate your dining experience.
      </p>

      <div className="explore-menu-list" role="listbox" aria-label="Food categories">
        {menu_list.map((item) => {
          const isActive = String(category) === String(item.menu_name);
          return (
            <button
              key={item.menu_name}
              type="button"
              className={`explore-menu-list-item ${isActive ? "active" : ""}`}
              onClick={() => onPick(item.menu_name)}
              role="option"
              aria-selected={isActive}
              tabIndex={0}
              title={item.menu_name}
            >
              <img src={item.menu_image} alt={item.menu_name} className="menu-image" />
              <div className="explore-menu-item-name">{item.menu_name}</div>
            </button>
          );
        })}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
