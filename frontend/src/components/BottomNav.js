import { Link } from "react-router-dom";
import "./BottomNav.css";

function BottomNav() {
  return (
    <div className="bottom-nav">
      <Link to="/farmer">Feed</Link>
      <Link to="/learn">Learn</Link>
      <Link to="/videos">Videos</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
}

export default BottomNav;
