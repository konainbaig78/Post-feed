document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const postButton = document.getElementById('post-button');
    const postContentInput = document.getElementById('post-content');
  
    // Like Button Functionality
    const handleLikeButton = (button) => {
      const likeCount = button.querySelector('.like-count');
      let count = parseInt(likeCount.textContent, 10);
      count++;
      likeCount.textContent = count;
      button.style.backgroundColor = '#28a745'; // Change color on like
    };
  
    // Add New Post
    postButton.addEventListener('click', () => {
      const postContent = postContentInput.value.trim();
  
      if (postContent === '') {
        alert('Post content cannot be empty!');
        return;
      }
  
      // Create a new post element
      const post = document.createElement('div');
      post.classList.add('post');
  
      post.innerHTML = `
        <div class="post-header">
          <img src="https://via.placeholder.com/50" alt="User Avatar" class="avatar">
          <h2 class="username">You</h2>
          <span class="timestamp">Just now</span>
        </div>
        <p class="post-content">${postContent}</p>
        <div class="post-actions">
          <button class="like-btn">Like <span class="like-count">0</span></button>
          <button class="comment-btn">Comment</button>
        </div>
      `;
  
      // Append the new post to the feed container
      feedContainer.prepend(post);
  
      // Add functionality to the like button
      const likeButton = post.querySelector('.like-btn');
      likeButton.addEventListener('click', () => handleLikeButton(likeButton));
  
      // Clear the textarea
      postContentInput.value = '';
    });
  });
  