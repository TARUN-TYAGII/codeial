{
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/post/create",
        data: newPostForm.serialize(),
        success: function (data) {
          console.log("DATAAAAAAAA", data);
          let newPost = newPostDom(data.data.post);
          deletePost($(" .delete-post-button", newPost));
          $("#posts-list-container > ul").prepend(newPost);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // Method to create a post in the DOM

  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}" >
     <p>
        
       
         <small>
           <a class="delete-post-button" href="/post/destroy/${post._id}">X</a>
         </small>
      
         ${post.content}
       
       <small> ${post.user.name}</small>
       <div class="post-comments">
         
            <form action="/comment/create" method="post">
              <input type="text" name="content" placeholder="Add comment" required>
              <input type="hidden" name="post" value="${post._id}">
              <input type="submit" value="Add comment">
            </form>

            <div class="post-comments-list">
          <ul id="post-comments-${post._id}">
            
          </ul>
        </div>

         
 
          
       </div>
     </p>
    </li>`);
  };

  //Method to delete a post

  let deletePost = function (deleteLink) {
    $("deleteLink").click(function (e) {
      e.preventDefault();
    });

    $.ajax({
      type: "get",
      url: $("deleteLink").prop("href"),
      success: function (data) {
        $(`#post-${data.post.id}`).remove();
      },
      error: function (err) {
        console.log(error.responseText);
      },
    });
  };

  createPost();
}
