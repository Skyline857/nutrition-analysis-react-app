import { useState } from "react";
import { useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./LoaderPage";

function App() {
  const [mySearch, setMySearch] = useState();
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState();
  const [stateLoader, setStateLoader] = useState(false);

  const APP_ID = 'fce4a75d';
  const APP_KEY = 'e32ee132188e3f1dd53c6f5ee4f67f91';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setStateLoader(false);
      const data = await response.json();
      setMyNutrition(data);
    } else {
      setStateLoader(false);
      alert('ingredients entered incorrectly');
    }
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])

  return (
      <div className="container">
        {stateLoader && <LoaderPage />}
    
        <h1>Nutrition Analysis</h1>
        <form onSubmit={finalSearch}>
          <input
            placeholder="Search..."
            onChange={myRecipeSearch}
          />
          <button type="submit">Search</button>
        </form>
        <div className="nutrition-container">
          <h2>Nutrition Facts</h2>
          {
            myNutrition && (
              <>
                <div className="nutrition-item">
                  <span className="nutrition-label">Calories:</span>
                  <span className="nutrition-value">{myNutrition.calories} kcal</span>
                </div>
                {Object.values(myNutrition.totalNutrients).map(({ label, quantity, unit }) => (
                  <div key={label} className="nutrition-item">
                    <span className="nutrition-label">{label}:</span>
                    <span className="nutrition-value">{quantity.toFixed(2)} {unit}</span>
                  </div>
                ))}
              </>
            )
          }
        </div>
      </div>
    );    
}

export default App;

