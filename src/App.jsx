import { useState } from 'react'
import './App.css'

const commonPlaces = {};
const colorMap = ['red', 'blue', 'green', 'orange', 'purple', 'black','yellow'];
let colorIndex = 0;

function isValidJeepCode(code) {
  const regex = /^\d{2}[a-zA-Z]$/;
  return regex.test(code.trim());
}

function findSimilarities(routesData, codes) {
  const similarities = {};

  for (let i = 0; i < codes.length; i++) {
      const code1 = codes[i];

      for (let j = i + 1; j < codes.length; j++) {
          const code2 = codes[j];
          const places1 = routesData[code1];
          const places2 = routesData[code2];
          const sharedPlaces = places1.filter(place => places2.includes(place));
          console.log("Shared places", sharedPlaces + "\n")

          if (sharedPlaces.length > 0) {
              if (!similarities[code1]) similarities[code1] = {};
              if (!similarities[code2]) similarities[code2] = {};

              sharedPlaces.forEach(place => {
                  if (!similarities[code1][code2]) similarities[code1][code2] = [];
                  if (!similarities[code2][code1]) similarities[code2][code1] = [];
                  
                  similarities[code1][code2].push(place);
                  similarities[code2][code1].push(place);
              });
              commonPlaces[`${code1}-${code2}`] = colorMap[colorIndex++]
          }
      }
  }

  return similarities;
}

// console.log("Shared places", sharedPlaces + "\n")


function App() {
  const [jeepCode, setJeepCode] = useState("")
  const [foundRoutes, setFoundRoutes] = useState([])
  const [invalidCode, setInvalidCode] = useState(false)
  
  const routesData =  {
    "01A": ["Alpha", "Bravo", "Charlie", "Echo", "Golf"],
    "02B": ["Alpha", "Delta", "Echo", "Foxtrot", "Golf"],
    "03C": ["Charlie", "Delta", "Foxtrot", "Hotel", "India"],
    "04A": ["Charlie", "Delta", "Echo", "Foxtrot", "Golf"],
    "04D": ["Charlie", "Echo", "Foxtrot", "Golf", "India"],
    "06B": ["Delta", "Hotel", "Juliet", "Kilo", "Lima"],
    "06D": ["Delta", "Foxtrot", "Golf", "India", "Kilo"],
    "10C": ["Foxtrot", "Golf", "Hotel", "India", "Juliet"],
    "10H": ["Foxtrot", "Hotel", "Juliet", "Lima", "November"],
    "11A": ["Foxtrot", "Golf", "Kilo", "Mike", "November"],
    "11B": ["Foxtrot", "Golf", "Lima", "Oscar", "Papa"],
    "20A": ["India", "Juliet", "November", "Papa", "Romeo"],
    "20C": ["India", "Kilo", "Lima", "Mike", "Romeo"],
    "42C": ["Juliet", "Kilo", "Lima", "Mike", "Oscar"],
    "42D": ["India", "November", "Oscar", "Quebec", "Romeo"]
  }

  const handleSubmit = () => {
    colorIndex = 0
    const codes = jeepCode.split(',').map(code => code.trim());
    const validCodes = codes.filter(code => isValidJeepCode(code));
    
    if (validCodes.length === codes.length) {
      console.log("All codes are valid:", validCodes);
      const similarities = findSimilarities(routesData, validCodes);
      console.log("Similariites", similarities)
      console.log("CommonPlaces", commonPlaces)
      const tempRoutes = validCodes.map(code => {
        const places = routesData[code];
        const formattedPlaces = places.map(place => {
          let color = 'black';
  
          for (const otherCode in similarities[code]) {
            if (similarities[code][otherCode].includes(place)) {
              color = commonPlaces[`${code}-${otherCode}`] || commonPlaces[`${otherCode}-${code}`];
              break;
            }
          }
          
          return <span key={place} style={{ color: color }}>{place}</span>;
        });
        return (
          <div key={code}>
            {code}: {formattedPlaces.reduce((prev, curr) => [prev, ' <-> ', curr])}
          </div>
        );
      });
      setFoundRoutes(tempRoutes);
      setInvalidCode(false)
    } else {
      setInvalidCode(true)
      console.log("Invalid codes found:", codes.filter(code => !isValidJeepCode(code)));
    }
};


return (
  <div className='container'>
    <div className="content">
      <div className="input-container">
        <h1>Input Jeepney Code:</h1>
        <input type="text" value={jeepCode} onChange={(e) => setJeepCode(e.target.value) } />
        <button onClick={handleSubmit}>Submit Code</button>
      </div>
      <div>
        {invalidCode ? (
          <h1>Invalid Code</h1>
        ) : (
          <div>
            <h1>The Paths are: </h1>
            {foundRoutes.length > 0 && foundRoutes.map((route, index) => (
              <div className='routes-container' key={index}>
                {route}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default App
