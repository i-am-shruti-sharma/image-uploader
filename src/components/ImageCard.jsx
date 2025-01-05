import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ImageCard = ({
    item,
    expandEdit,
    setExpandEditModal,
    edit,
    hide,
    deleteImg,
    addToFav,
  }) => {
    return (
      <div className="img">
        <img src={item?.url} alt={item} />
        <div className="h">
          {item?.name ? item?.name : "Untitled"}
          {item?.favourite ? (
            <FavoriteIcon
              sx={{ cursor: "pointer" }} 
              onClick={(e) => addToFav(item)}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{ cursor: "pointer" }}
              onClick={(e) => addToFav(item)}
            />
          )}
        </div>
  
        <div className="b">
          <div className="round">
            <div className="icon">GL</div>
            <div className="tip">
              Gokul Lalasan
              {/* Since we don't have auth as of now is is hard coded */}
              <span>{item?.createdAt}</span>
            </div>
          </div>
          <div className="round">
            <div
              className="icon"
              onClick={(e) => {
                setExpandEditModal(expandEdit == item?.id ? -1 : item?.id);
              }}
            >
              <MoreVertIcon />
            </div>
            {expandEdit == item?.id && (
              <div className="cont">
                <div className="item" onClick={(e) => edit(item)}>
                  Edit
                </div>
                <div className="item" onClick={(e) => hide(item)}>
                  Hide
                </div>
                <div
                  className="item"
                  style={{ color: "#F7685B" }}
                  onClick={(e) => deleteImg(item)}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ImageCard;