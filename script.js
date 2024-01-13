class Card {
    constructor(post, user) {
      this.post = post;
      this.user = user;
      this.createCard();
    }

    createCard() {
      const cardContainer = document.getElementById('posts-container');
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.addEventListener('click', () => this.deleteCard());

      cardElement.innerHTML = `
        <h2>${this.post.title}</h2>
        <p>${this.post.body}</p>
        <p>Author: ${this.user.name} ${this.user.email}</p>
      `;
      cardElement.appendChild(deleteButton);
      cardContainer.appendChild(cardElement);
    }

    deleteCard() {
      const postId = this.post.id;
      fetch(`https://ajax.test-danit.com/api/json/posts/${postId}`, { method: 'DELETE' })
        .then(() => {
          const cardElement = document.querySelector('.card');
          if (cardElement) {
            cardElement.remove();
          }
        })
        .catch(error => console.error('Delete request failed:', error));
    }
}

const usersPromise = fetch('https://ajax.test-danit.com/api/json/users');
const postsPromise = fetch('https://ajax.test-danit.com/api/json/posts');

Promise.all([usersPromise, postsPromise])
.then(responses => Promise.all(responses.map(response => response.json())))
.then(([users, posts]) => {
  posts.forEach(post => {
    const userId = post.userId;
    const user = users.find(user => user.id === userId);
    new Card(post, user);
  });
})
.catch(error => console.error('API requests failed:', error));