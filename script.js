const input= document.querySelector('#search-input');
const suggestionsContainer = document.querySelector('.suggestions');
const repositoriesContainer = document.querySelector('.repositories-results');

const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        console.log('input detector');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            console.log('debounce finished');
            func.apply(this, args);
        }, delay);
    };
};

input.addEventListener('input', debounce(function(){
    console.log('user enters text');
    let searchText = input.value;
    console.log(searchText);

    if(!searchText){
        console.log('search is empty');
        suggestionsContainer.innerHTML='';
    }
    else{
        console.log('searching for:', searchText);

        fetch(`https://api.github.com/search/repositories?q=${searchText}`)
            .then(response => {
                if(!response.ok){
                    return Promise.reject(new Error('Error fetching repositories'));
                }
                
                    return response.json();
                
            })
            .then(data => {
                console.log(data);
            const repo5 = data.items.slice(0,5);
            console.log(repo5);
            console.log(repo5[0].name);
           
            suggestionsContainer.innerHTML='';
            repo5.forEach(repo => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = repo.name;
                suggestionItem.addEventListener('click', () => {
                    input.value = repo.name;
                    suggestionsContainer.innerHTML = '';
                const repositoryItem = document.createElement('div');
                repositoryItem.classList.add('repository-item');
               
                const repoName = document.createElement('div');
                repoName.textContent = repo.name;
                const repoOwner = document.createElement('div');
                repoOwner.textContent = repo.owner.login;
                const repoStars = document.createElement('div');
                repoStars.textContent = `Stars: ${repo.stargazers_count}`;
                repositoryItem.appendChild(repoName);
                repositoryItem.appendChild(repoOwner);
                repositoryItem.appendChild(repoStars);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'x';
                 repositoryItem.appendChild(deleteButton);
                 deleteButton.addEventListener('click', () => {
                    repositoryItem.remove();

                });
                repositoriesContainer.appendChild(repositoryItem);
                });
                
                suggestionsContainer.appendChild(suggestionItem);
            });

            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

}, 1000));