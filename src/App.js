import "./styles.css";

export default function ListingAd({ pic, title, address, description }) {
  return (
    <div className="App">
      <img className="mainPic" width="300" height="500" src={pic} />
      <div className="mainContent">
        <h1>{title}</h1>
        <p className="address">{address}</p>
        <button>See description</button>
        <p className="description">{description}</p>
      </div>
    </div>
  );
}
