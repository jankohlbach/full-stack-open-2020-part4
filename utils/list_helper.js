const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0);

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null;

  return blogs.reduce((prev, curr) => prev.likes > curr.likes
    ? {
      title: prev.title,
      author: prev.author,
      likes: prev.likes,
    }
    : {
      title: curr.title,
      author: curr.author,
      likes: curr.likes,
    }
  , {});
};

const mostBlogs = (blogs) => {
  if(blogs.length === 0) return null;

  if(blogs.length === 1) return {author: blogs[0].author, blogs: 1};

  let result = {};
  blogs.map(({author}) => {
    result = {
      ...result,
      [author]: result[author] + 1 || 1,
    };
  });

  return Object.entries(result).reduce((prev, curr) => prev[1] > curr[1]
    ? {
      author: prev[0],
      blogs: prev[1],
    }
    : {
      author: curr[0],
      blogs: curr[1],
    }
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
