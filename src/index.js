document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterBtn = document.getElementById('good-dog-filter');
    let filterOn = false;
  
    // Fetch all pups and render them in the dog bar
    function fetchAndRenderPups() {
      dogBar.innerHTML = ''; // Clear existing pups
      fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then(pups => {
          const filteredPups = filterOn ? pups.filter(pup => pup.isGoodDog) : pups;
          filteredPups.forEach(renderPupSpan);
        })
        .catch(err => console.error('Error fetching pups:', err));
    }
  
    // Render a single pup span in the dog bar
    function renderPupSpan(pup) {
      const span = document.createElement('span');
      span.textContent = pup.name;
      span.addEventListener('click', () => displayPupInfo(pup));
      dogBar.appendChild(span);
    }
  
    // Display pup info in the dog-info div
    function displayPupInfo(pup) {
      dogInfo.innerHTML = `
        <img src="${pup.image}" />
        <h2>${pup.name}</h2>
        <button id="good-dog-btn">${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
      `;
  
      const goodDogBtn = document.getElementById('good-dog-btn');
      goodDogBtn.addEventListener('click', () => toggleGoodDogStatus(pup));
    }
  
    // Toggle isGoodDog status and update the button + database
    function toggleGoodDogStatus(pup) {
      pup.isGoodDog = !pup.isGoodDog;
      const goodDogBtn = document.getElementById('good-dog-btn');
      goodDogBtn.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
  
      // Update the database via PATCH request
      fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isGoodDog: pup.isGoodDog })
      })
        .then(res => res.json())
        .then(updatedPup => {
          if (filterOn) fetchAndRenderPups(); // Re-render if filter is on
        })
        .catch(err => console.error('Error updating pup:', err));
    }
  
    // Toggle filter and re-render pups
    filterBtn.addEventListener('click', () => {
      filterOn = !filterOn;
      filterBtn.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`;
      fetchAndRenderPups();
    });
  
    // Initial fetch
    fetchAndRenderPups();
  });