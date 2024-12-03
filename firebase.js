import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUevmHcU28habKuKI7Fhfem3B6IWyKh-s",
    authDomain: "firestore-post.firebaseapp.com",
    projectId: "firestore-post",
    storageBucket: "firestore-post.firebasestorage.app",
    messagingSenderId: "276137029379",
    appId: "1:276137029379:web:d7aafc2503d22ac638c336",
    measurementId: "G-J2ZTSDNST8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const feedContainer = document.getElementById("feed-container");
  const postButton = document.getElementById("post-button");
  const postContentInput = document.getElementById("post-content");
  const postImageInput = document.getElementById("post-image");

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dzezzvkhn/image/upload";
  const UPLOAD_PRESET = "dezsqdzz";

  // Function to upload an image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary upload failed:", errorText);
        throw new Error("Failed to upload image to Cloudinary.");
      }

      const data = await response.json();
      return data.secure_url; // Return the uploaded image's URL
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed. Please try again.");
      return null;
    }
  };

  // Function to render a post
  const renderPost = (post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    postElement.innerHTML = `
      <div class="post-header">
        <img src="https://via.placeholder.com/50" alt="User Avatar" class="avatar">
        <h2 class="username">${post.username || "Anonymous"}</h2>
        <span class="timestamp">${new Date(post.timestamp?.seconds * 1000).toLocaleString()}</span>
      </div>
      <p class="post-content">${post.content}</p>
      ${
        post.imageUrl
          ? `<img src="${post.imageUrl}" alt="Post Image" class="post-image">`
          : ""
      }
      <div class="post-actions">
        <button class="like-btn">Like <span class="like-count">0</span></button>
        <button class="comment-btn">Comment</button>
      </div>
    `;

    feedContainer.prepend(postElement);
  };

  // Real-time listener for Firestore updates
  onSnapshot(collection(db, "posts"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        renderPost(change.doc.data());
      }
    });
  });

  // Add new post with Cloudinary integration
  postButton.addEventListener("click", async () => {
    const postContent = postContentInput.value.trim();
    const file = postImageInput.files[0];

    if (!postContent && !file) {
      alert("Post content or image cannot be empty!");
      return;
    }

    let imageUrl = null;

    // Upload image if provided
    if (file) {
      imageUrl = await uploadImageToCloudinary(file);
      if (!imageUrl) {
        alert("Failed to upload the image. Please try again.");
        return;
      }
    }

    // Add post to Firestore with both image URL and text content
    try {
      await addDoc(collection(db, "posts"), {
        content: postContent,
        imageUrl: imageUrl || null, // If there's no image, store null
        username: "You", // Replace with actual username if available
        timestamp: serverTimestamp(),
      });

      // Clear input fields
      postContentInput.value = "";
      postImageInput.value = "";
    } catch (error) {
      console.error("Error adding post to Firestore:", error);
      alert("Failed to create post. Please try again.");
    }
  });
});
