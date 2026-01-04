import BottomNav from "../components/BottomNav";

function Videos() {
  return (
    <div style={{ paddingBottom: "70px" }}>
      <div style={{ padding: "16px" }}>
        <h2>🎥 Farming Videos</h2>

        <div className="post-card">
          <h4>🌾 <h4>🌾 వరి సాగు పూర్తి సమాచారం</h4></h4>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/TYY3pe5pNCU"
            title="Paddy cultivation"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <div className="post-card">
          <h4>🍅 Tomato farming – best practices</h4>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/_-FLCU2TRUA"
            title="Tomato farming"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <div className="post-card">
          <h4>🌱 Organic farming basics (India)</h4>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/3viUlVOaorI"
            title="Organic farming"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Videos;
