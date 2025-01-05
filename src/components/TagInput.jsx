import React, { useState } from "react";
import tagImg from './../assets/shoppingmode.svg';
import { Close } from "@mui/icons-material";
const TagInput = ({setTagList,tagList}) => {
  const [inputValue, setInputValue] = useState(""); 

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      setTagList([...tagList, inputValue.trim()]); 
      setInputValue(""); 
    }
  };

  const removeTag = (index) => {
    setTagList(tagList.filter((_, i) => i !== index)); 
  };

  return (
    <div>
      <div
       className="textarea"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type something..."
          style={{
            border: "none",
            outline: "none",
            flex: "1",
            minWidth: "100px",
          }}
        />
      </div>
      <div className="tags">
      {tagList.map((tag, index) => (
          <div
          className="tag"
            key={index}
          >
            <img src={tagImg} width={14} height={14}/>
            <span>{tag}</span>
            <Close  onClick={() => removeTag(index)} sx={{fontSize:'14px',cursor:'pointer'}}/>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TagInput;
